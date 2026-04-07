import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from '../../utils/socket';
import { getAuctionProductDetails } from "../../api/auctions";
import { placeBid } from "../../api/User/Bidding";
import { useSelector } from "react-redux";
import { usePayment } from "../../hooks/UsePayment";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";
import PaymentModal from "../../components/paymentModal";
import { confirmPayment } from "../../api/User/wallet";
import type { RootState } from "../../redux/store";
import { AxiosError } from "axios";
import { getSellerReviews } from "../../api/User/Review";
import type { Review } from "../../types/review";


interface Bid {
    bidderId: string;
    bidderName?: string;
    amount: number;
    time: Date;
}

interface Auction {
    id: string;
    title: string;
    description: string;
    currentPrice: number;
    startingPrice: number;
    startTime: string;
    endDate: string;
    status: string;
    type: string;
    sellerId: string;
    winnerId: string;
    paymentStatus?: string;
    images?: string[];
    bids: Bid[];
}

export default function LiveAuctionRoom() {
    const [auction, setAuction] = useState<Auction | null>(null);
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState("");
    const [bidding, setBidding] = useState(false);
    const [viewerCount, setViewerCount] = useState(1);
    const [liveFeed, setLiveFeed] = useState<Bid[]>([]);
    const [auctionStatus, setAuctionStatus] = useState("");
    const [sellerReviews,setSellerReviews]=useState({reviews:[],averageRating:0,total:0});
    const [timeLeft, setTimeLeft] = useState("");
    const [selectedImage, setSelectedImage] = useState<string>("");
    const { paymentSession, initiating, initiatePayment, closePayment } = usePayment();

    const { id } = useParams();
    const currentUser = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (auction?.images && auction.images.length > 0) {
            setSelectedImage(auction.images[0]);
        }
    }, [auction]);

    useEffect(() => {
        if (!auction?.endDate || auctionStatus !== 'active') return;
        const timer = setInterval(() => {
            const diff = +new Date(auction!.endDate) - +new Date();
            if (diff <= 0) {
                setTimeLeft("Ended");
                clearInterval(timer);
                return;
            }
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff / 1000 / 60) % 60);
            const s = Math.floor((diff / 1000) % 60);

            setTimeLeft(`${String(h).padStart(2, '0')} : ${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(timer);
    }, [auction, auctionStatus]);

    // Socket
    useEffect(() => {
        if (!id) return;
        socket.connect();
        socket.emit("join_auction", id);
        socket.on('viewer_count', (data) => setViewerCount(data.count));
        socket.on("bid_update", (data) => {
            setAuction(prev => prev ? { ...prev, currentPrice: data.newPrice } : prev);
            if (data.bid) {
                setLiveFeed(prev => [data.bid, ...prev].slice(0, 50));
            }
        });
        socket.on("auction_started", () => {
            setAuctionStatus("active");
            toast.success("Auction is now Live");
        });
        socket.on("auction_ended", (data) => {
            setAuctionStatus(data.status || 'sold');
            setAuction(prev => prev ? { ...prev, winnerId: data.winnerId, status: data.status || 'sold', currentPrice: data.finalPrice || prev.currentPrice } : prev);
            toast.success("Auction ended");
        });
        socket.on("auction_cancelled", (data) => {
            setAuctionStatus('cancelled');
            toast.error(data.message);
        });

        return () => {
            ["viewer_count", "bid_update", "auction_started", "auction_ended", "auction_cancelled"].forEach(e => socket.off(e));
            socket.disconnect();
        }
    }, [id]);

    // Fetch
    useEffect(() => {
        if (!id) return;
        getAuctionProductDetails(id)
            .then(res => {
                const d = res.data.data || res.data;
                setAuction(d);
                setAuctionStatus(d.status);
                setLiveFeed(d.bids || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));

        const poll = setInterval(async () => {
            try {
                const res = await getAuctionProductDetails(id);
                const d = res.data.data || res.data;
                if (d.status !== auctionStatus) {
                    setAuctionStatus(d.status);
                    setAuction(d);
                }
            } catch (r) { console.error(r) }
        }, 30000);
        return () => clearInterval(poll)
    }, [id, auctionStatus]);

    useEffect(()=>{
        const fetchReviews=async()=>{
            if(auction?.sellerId){
                try{
                    const res=await getSellerReviews(auction.sellerId,1,5);
                    setSellerReviews(res.data);
                }catch(error){
                    console.error("Failed to fetch seller reviews",error);
                }
            }
        }
        fetchReviews();
    },[auction?.sellerId]);

    const handleBid = async () => {
        if (!auction || !bidAmount) return;
        const amount = Number(bidAmount);
        if (amount <= auction.currentPrice) {
            toast.error(`Must be greater than ₹${auction.currentPrice}`);
            return;
        }
        setBidding(true);
        try {
            await placeBid(id!, amount);
            setBidAmount("");
            toast.success("Bid placed");
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>
            toast.error(err.response?.data?.message || "Failed");
        } finally {
            setBidding(false);
        }
    }

    // const isSeller = currentUser?.id === auction?.sellerId;
    const isActive = auctionStatus === 'active';
    const isPending = auctionStatus === 'pending' || auctionStatus === 'approved';

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>
    if (!auction) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Not found</div>

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <Navbar />

            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-4 md:px-6 py-3 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm gap-2">
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    {isActive && <span className="bg-red-600 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.7)]">🔴 LIVE</span>}
                    {isPending && <span className="bg-yellow-500 text-black text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full">⏳ UPCOMING</span>}
                    {auctionStatus === "sold" && <span className="bg-green-600 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full">✅ ENDED</span>}
                    {auctionStatus === "cancelled" && <span className="bg-gray-600 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full">❌ CANCELLED</span>}
                    <h1 className="text-lg md:text-xl font-bold tracking-wide truncate max-w-[200px] sm:max-w-none">{auction.title}</h1>
                </div>
                <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-sm text-gray-400 font-medium tracking-wide w-full md:w-auto justify-between md:justify-end">
                    <span className="flex items-center gap-1 shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        {viewerCount}
                    </span>
                    {isActive && <span className="font-mono text-white bg-gray-700 px-2 py-1 rounded opacity-90 shrink-0">⏱ {timeLeft}</span>}
                    {isPending && (
                        <span className="text-yellow-400 text-xs font-semibold text-right">
                            🗓 Starts {auction.startTime ? new Date(auction.startTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : new Date(auction.endDate).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-col lg:flex-row flex-1">

                {/* Left Side: Images & Details */}
                <div className="lg:w-1/2 bg-gray-950 p-6 flex flex-col items-center overflow-y-auto">

                    {/* Main Image */}
                    <div className="w-full h-80 bg-[#111827] rounded-xl flex items-center justify-center overflow-hidden mb-5 border border-gray-800 shadow-md">
                        {selectedImage ? (
                            <img src={selectedImage} alt={auction.title} className="h-full object-contain" />
                        ) : (
                            <div className="text-gray-600 text-3xl font-bold opacity-30">No Image Available</div>
                        )}
                    </div>

                    {/* Image Thumbnail Slider */}
                    {auction.images && auction.images.length > 1 && (
                        <div className="w-full flex gap-3 overflow-x-auto pb-3 justify-center mb-6 overflow-y-hidden">
                            {auction.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-20 h-14 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 flex-shrink-0 ${selectedImage === img
                                            ? 'border-blue-500 scale-105 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                            : 'border-transparent opacity-50 hover:opacity-100'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                                        {/* Seller Rating Section */}
                    {sellerReviews.total > 0 && (
                        <div className="w-full bg-[#111827] rounded-xl p-6 border border-gray-800 text-left mb-6 shadow-sm flex items-center justify-start gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Seller Rating</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl font-black text-white leading-none">{sellerReviews.averageRating}</span>
                                    <div className="flex items-center text-yellow-500 text-xl tracking-widest drop-shadow-sm">
                                        {'★'.repeat(Math.round(sellerReviews.averageRating || 0))}
                                        <span className="text-gray-700">{'★'.repeat(Math.max(0, 5 - Math.round(sellerReviews.averageRating || 0)))}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[2px] h-10 bg-gray-700/80 rounded-full"></div>
                            <div className="flex flex-col justify-center">
                                <span className="text-xl font-black text-gray-300 leading-none mb-1">{sellerReviews.total}</span>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reviews</span>
                            </div>
                        </div>
                    )}


                    {/* About This Item Description */}
                    <div className="w-full bg-[#111827] rounded-xl p-6 border border-gray-800 text-left mt-2 shadow-sm">
                        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            About this Item
                        </h2>
                        <div className="w-16 h-1 bg-blue-600 mb-4 rounded-full"></div>
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                            {auction.description || "No description provided by the seller."}
                        </p>
                    </div>

                                        {/* SELLER REVIEWS SECTION */}
                    <div className="w-full bg-[#111827] rounded-xl p-6 border border-gray-800 text-left mt-5 shadow-sm">
                        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <span className="text-yellow-500">★</span>
                            Recent Reviews
                        </h2>
                        <div className="w-16 h-1 bg-yellow-500 mb-4 rounded-full"></div>
                        
                        {sellerReviews.reviews.length > 0 ? (
                            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                {sellerReviews.reviews.map((review: Review) => (
                                    <div key={review.id || review._id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center text-yellow-500 text-sm">
                                                {'★'.repeat(Math.round(review.rating))}
                                                <span className="text-gray-700">{'★'.repeat(Math.max(0, 5 - Math.round(review.rating)))}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 text-sm italic leading-relaxed">"{review.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 italic text-sm border border-dashed border-gray-800 rounded-lg bg-gray-900/50">
                                No reviews yet!
                            </div>
                        )}
                    </div>


                </div>

                {/* Right Side: Bid Panel & Feed */}
                <div className="lg:w-1/2 flex flex-col border-l border-gray-800 bg-gray-900 shadow-xl z-10 w-full">

                    <div className="bg-gray-800 p-6 md:p-8 border-b border-gray-700 shadow-sm relative">
                        <p className="text-[10px] md:text-xs text-gray-400 mb-1 uppercase tracking-wider font-semibold">Current Highest Bid</p>
                        <p className="text-3xl md:text-5xl font-extrabold text-green-400 tracking-tight drop-shadow-sm">₹{(auction.currentPrice || auction.startingPrice).toLocaleString('en-IN')}</p>
                    </div>

                    <div className="p-4 md:p-8 border-b border-gray-800 bg-gray-800/50">
                        {isActive ? (
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                <div className="relative flex-1">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                    <input
                                        type="number"
                                        placeholder={`Min ${(auction.currentPrice + 1).toLocaleString('en-IN')}`}
                                        value={bidAmount}
                                        onChange={e => setBidAmount(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-700 text-white pl-10 pr-4 py-3 md:py-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-base md:text-lg shadow-inner"
                                    />
                                </div>
                                <button onClick={handleBid} disabled={bidding}
                                    className="bg-blue-600 hover:bg-blue-500 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                                    {bidding ? "..." : "PLACE BID"}
                                </button>
                            </div>
                        ) : (
                            <div className="p-6 rounded-xl font-bold text-center bg-gray-900 border border-gray-700 text-gray-300 shadow-inner">
                                {isPending && "⏳ Auction starting soon..."}
                                {/* {auctionStatus === "sold" && <span className="text-yellow-400">🏆 Auction successfully sold!</span>} */}
                                {auctionStatus === "sold" && (
                                    <div className="space-y-3 w-full mt-2">
                                        {auction?.winnerId === currentUser?.id ? (
                                            <div className="bg-green-900/40 text-green-400 p-4 rounded-lg font-bold border border-green-800/50 shadow-inner">
                                                🏆 You won this auction!
                                            </div>
                                        ) : (
                                            <span className="text-yellow-400 block mb-2 font-bold p-3 bg-yellow-900/20 rounded-lg border border-yellow-800/30">🏆 Auction successfully sold!</span>
                                        )}

                                        {/* Pay button — only visible to the winner if payment is pending */}
                                        {currentUser?.id === auction?.winnerId && auction?.paymentStatus !== 'completed' && (
                                            <button
                                                onClick={() => initiatePayment(auction.id, (auction.currentPrice || auction.startingPrice) * 100)}
                                                disabled={initiating}
                                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg disabled:opacity-50 text-lg uppercase tracking-wide"
                                            >
                                                {initiating ? 'Preparing payment...' : 'Pay Now'}
                                            </button>
                                        )}
                                        {currentUser?.id === auction?.winnerId && auction?.paymentStatus === 'completed' && (
                                            <div className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-center shadow-lg uppercase tracking-wide">
                                                ✅ Payment Completed
                                            </div>
                                        )}
                                    </div>
                                )}

                                {auctionStatus === "cancelled" && <span className="text-red-400">❌ Auction was cancelled by admin</span>}
                                {auctionStatus === "expired" && "⛔ Auction expired without bids"}
                            </div>
                        )}

                        {/* Seller Controls */}
                        {/* {isSeller && (
                            <div className="flex gap-4 mt-6">
                                {isPending && (
                                    <button onClick={() => startLiveAuction(id!).then(() => { toast.success("Started!"); setAuctionStatus("active"); }).catch(e => toast.error(e.response?.data?.message))}
                                        className="flex-1 bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-0.5 uppercase tracking-wide text-sm">
                                        ▶ Start Live Auction
                                    </button>
                                )}
                                {isActive && (
                                    <button onClick={() => endLiveAuction(id!).then(() => { toast.success("Ended!"); setAuctionStatus("sold"); }).catch(e => toast.error(e.response?.data?.message))}
                                        className="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-0.5 uppercase tracking-wide text-sm flex justify-center items-center gap-2">
                                        🔨 Drop Hammer
                                    </button>
                                )}
                            </div>
                        )} */}
                    </div>

                    {/* Live Feed */}
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-900 custom-scrollbar">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Live Activity Feed</h3>
                            <div className="w-full flex-1 h-px bg-gray-800"></div>
                        </div>

                        {liveFeed.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-gray-600 gap-3 border border-gray-800 rounded-lg border-dashed">
                                <p className="font-medium text-sm">No bids yet. Start the action!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {liveFeed.map((bid, i) => (
                                    <div key={i} className={`flex justify-between items-center p-3 rounded-lg border ${i === 0 ? 'bg-blue-900/20 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-gray-800 border-gray-700'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                                {bid?.bidderName ? bid.bidderName.substring(0, 2).toUpperCase() : 'AN'}
                                            </div>
                                            <span className={`text-sm ${i === 0 ? 'text-white font-semibold' : 'text-gray-300'}`}>
                                                {bid?.bidderName || "Anonymous"}
                                            </span>
                                        </div>
                                        <div className="text-right flex flex-col">
                                            <span className={`block font-bold ${i === 0 ? 'text-green-400 text-lg' : 'text-gray-300'}`}>
                                                ₹{bid.amount.toLocaleString('en-IN')}
                                            </span>
                                            <span className="text-xs text-gray-500 font-mono">
                                                {new Date(bid.time).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
            {paymentSession && (
                <PaymentModal
                    isOpen={true}
                    clientSecret={paymentSession.clientSecret}
                    amount={(auction.currentPrice || auction.startingPrice) * 100}
                    title="Complete Auction Payment"
                    onSuccess={async () => {
                        await confirmPayment({ paymentIntentId: paymentSession.paymentIntentId, auctionId: auction!.id });
                        closePayment();
                        setAuction((prev) => prev ? { ...prev, paymentStatus: 'completed' } : prev)
                    }}
                    onClose={() => closePayment()}
                />
            )}
        </div>
    );
}
