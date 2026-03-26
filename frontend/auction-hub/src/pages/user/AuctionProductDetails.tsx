import { useEffect, useState ,useCallback} from "react";
import { useParams } from "react-router-dom";
import { getAuctionProductDetails } from "../../api/auctions";
import { placeBid } from "../../api/User/Bidding";
import { socket } from "../../utils/socket";
import { usePayment } from "../../hooks/UsePayment";
import PaymentModal from "../../components/paymentModal";
import { useSelector } from "react-redux";
import { confirmPayment } from "../../api/User/wallet";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import toast from "react-hot-toast";
import { checkWatchlist, addToWatchlist, removeFromWatchlist } from "../../api/User/watchlist";
import type { RootState } from "../../redux/store";
import type { Review } from "../../types/review";
import { AxiosError } from "axios";
import { getSellerReviews } from "../../api/User/Review";
// import type { BidItem } from "../../types/Bid";

interface Auction {
    id: string;
    title: string;
    description: string;
    currentPrice: number;
    startingPrice: number;
    endDate: string;
    status: string;
    winnerId?: string;
    images?: string[];
    image?: string;
    bids: Array<{
        bidderId: string;
        bidderName: string;
        amount: number;
        time: Date;
    }>;
    paymentStatus: string;
    sellerId:string;
}

export default function AuctionProductDetails() {
    const { id } = useParams();
    const [auction, setAuction] = useState<Auction | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState("");
    const [bidAmount, setBidAmount] = useState("");
    const [biddingLoading, setBiddingLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ h: "00", m: "00", s: "00", ended: false });
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const { paymentSession, initiating, initiatePayment, closePayment } = usePayment();
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [sellerReviews,setSellerReviews]=useState({reviews:[],averageRating:0,total:0});

    const calculateTimeLeft = useCallback(() => {
        if (!auction?.endDate) return { h: "00", m: "00", s: "00", ended: true };
        const difference = +new Date(auction.endDate) - +new Date();
        if (difference <= 0) return { h: "00", m: "00", s: "00", ended: true };

        return {
            h: String(Math.floor(difference / (1000 * 60 * 60))).padStart(2, '0'),
            m: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
            s: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
            ended: false
        };
    },[auction?.endDate]);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await checkWatchlist(id!);
                setIsWatchlisted(res.data.data.isWatchlisted);
            } catch(error) {
                console.error(error)

             }
        }
        if (id) checkStatus();
    }, [id]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    const fetchAuction = useCallback(async () => {
        if (!id) return;
        try {
            const res = await getAuctionProductDetails(id);
            const data = res.data.data || res.data;
            setAuction(data);
            if (data.images?.length > 0) setSelectedImage(data.images[0]);
            else setSelectedImage(data.image || "");
        } catch (error) {
            console.error(error);

        } finally {
            setLoading(false);
        }
    },[id]);

    useEffect(()=>{
        const fetchReviews=async()=>{
            if(auction?.sellerId){
                try{
                    const res=await getSellerReviews(auction.sellerId,1,5);
                    setSellerReviews(res.data)
                }catch(error){
                    console.error("Failed to fetch seller reviews",error);
                }
            }
        };
        fetchReviews();
    },[auction?.sellerId]);

    useEffect(() => {
        if (id) {
            socket.emit("join_auction", id);
            socket.on("bid_update", (data) => {
                setAuction((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        currentPrice: data.newPrice,
                        bids: [data.bid, ...prev.bids]
                    }
                });
            });
            socket.on("auction_ended",()=>{
                fetchAuction();
            })
        }
        return () => { 
            socket.off('bid_update');
            socket.off("auction_ended");
        };
    }, [id,fetchAuction]);

    const handleWatchlistToggle = async () => {
        try {
            if (isWatchlisted) {
                await removeFromWatchlist(id!);
                setIsWatchlisted(false);
                toast.success("Removed from Watchlist");
            } else {
                await addToWatchlist(id!);
                setIsWatchlisted(true);
                toast.success("Added To Watchlist");
            }
        } catch {
            toast.error("Failed to Update Watchlist");
        }
    };

    
    useEffect(() => { fetchAuction(); }, [fetchAuction]);

    const handlePlaceBid = async () => {
        if (!auction || !bidAmount || Number(bidAmount) <= (auction.currentPrice || auction.startingPrice)) {
            toast.error("Bid must be higher than current price");
            return;
        }
        setBiddingLoading(true);
        try {
            await placeBid(id!, Number(bidAmount));
            toast.success("Bid placed successfully!");
            setBidAmount("");
            fetchAuction();
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>;
            toast.error(err.response?.data?.message || "Bid Failed");
        } finally {
            setBiddingLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600 font-bold">Loading Premium Experience...</div>;
    if (!auction) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Auction not found</div>;

    const isActive = auction.status === 'active';

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-900 flex flex-col">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
                {/* 2-Column Hero Section */}
                <div className="flex flex-col lg:flex-row gap-8 items-start mb-12">
                    
                    {/* Left Side: Image Gallery */}
                    <div className="w-full lg:w-3/5 space-y-4">
                        <div className="relative group aspect-square sm:aspect-video bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                            <img src={selectedImage} alt={auction.title} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-4 left-4">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg ${isActive ? 'bg-green-500 text-white animate-pulse' : 'bg-red-500 text-white'}`}>
                                    {auction.status}
                                </span>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {auction.images && auction.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto py-2 px-1 scrollbar-hide">
                                {auction.images.map((img, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setSelectedImage(img)}
                                        className={`w-24 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === img ? 'border-blue-600 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side: Auction Action Card */}
                    <div className="w-full lg:w-2/5 sticky top-8">
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
                            {/* Decorative Background Element */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
                            
                            <div className="relative">
                                <div className="flex justify-between items-start mb-4">
                                    <h1 className="text-3xl font-black text-slate-800 leading-tight">{auction.title}</h1>
                                    <button onClick={handleWatchlistToggle} className={`text-2xl p-2 rounded-full hover:bg-slate-50 transition-colors ${isWatchlisted ? 'text-red-500' : 'text-slate-300'}`}>
                                        {isWatchlisted ? "❤️" : "🤍"}
                                    </button>
                                </div>

                                
                                {/* Rating Section */}
                                                               {sellerReviews.total > 0 && (
                                    <div className="mb-8 bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm inline-flex items-center gap-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Seller Rating</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl font-black text-slate-800 leading-none">{sellerReviews.averageRating}</span>
                                                <div className="flex items-center text-yellow-500 text-xl tracking-widest drop-shadow-sm">
                                                    {'★'.repeat(Math.round(sellerReviews.averageRating || 0))}
                                                    <span className="text-slate-200">{'★'.repeat(Math.max(0, 5 - Math.round(sellerReviews.averageRating || 0)))}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-[2px] h-10 bg-slate-200/80 rounded-full"></div>
                                        <div className="flex flex-col justify-center">
                                            <span className="text-xl font-black text-slate-700 leading-none mb-1">{sellerReviews.total}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reviews</span>
                                        </div>
                                    </div>
                                )}


                                {/* Timer Component */}
                                <div className="mb-8 p-5 bg-slate-900 rounded-2xl text-white flex justify-between items-center shadow-inner">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ends In</span>
                                    <div className="flex gap-3 font-mono text-2xl font-black">
                                        <div className="flex flex-col items-center"><span>{timeLeft.h}</span><span className="text-[8px] text-slate-500 uppercase">hrs</span></div>
                                        <span className="opacity-30 self-start mt-0.5">:</span>
                                        <div className="flex flex-col items-center"><span>{timeLeft.m}</span><span className="text-[8px] text-slate-500 uppercase">min</span></div>
                                        <span className="opacity-30 self-start mt-0.5">:</span>
                                        <div className="flex flex-col items-center text-blue-400"><span>{timeLeft.s}</span><span className="text-[8px] text-slate-500 uppercase">sec</span></div>
                                    </div>
                                </div>

                                {/* Price Section */}
                                <div className="mb-8 group">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Highest Bid</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-blue-600">₹{(auction.currentPrice || auction.startingPrice).toLocaleString('en-IN')}</span>
                                        <span className="text-slate-400 text-sm font-medium line-through">₹{(auction.startingPrice).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                {/* Action Area */}
                                <div className="space-y-4">
                                    {auction.status === 'sold' && auction.winnerId ? (
                                        <div className="space-y-4">
                                            <div className="bg-green-50 text-green-700 p-4 rounded-2xl font-bold border border-green-100 flex items-center gap-3">
                                                <span className="text-2xl">🏆</span>
                                                <div>
                                                    <p className="text-xs uppercase opacity-70">Auction Won By</p>
                                                    <p className="text-sm">User ID: {auction.winnerId.substring(0, 10)}...</p>
                                                </div>
                                            </div>
                                            {currentUser?.id === auction.winnerId && auction.paymentStatus !== 'completed' && (
                                                <button onClick={() => initiatePayment(auction.id, (auction.currentPrice || auction.startingPrice) * 100)} disabled={initiating}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg active:scale-95 disabled:opacity-50">
                                                    {initiating ? "Processing..." : "SECURE CHECKOUT"}
                                                </button>
                                            )}
                                            {auction.paymentStatus === 'completed' && (
                                                <div className="bg-slate-900 text-white py-4 rounded-2xl font-black text-center flex items-center justify-center gap-2">
                                                    <span className="text-green-400">✔</span> PAYMENT COMPLETED
                                                </div>
                                            )}
                                        </div>
                                    ) : !isActive ? (
                                        <div className="bg-slate-100 text-slate-500 p-5 rounded-2xl text-center font-bold">Auction has concluded</div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                                <input 
                                                    type="number" 
                                                    placeholder={`Min 1 + Current Price`} 
                                                    value={bidAmount}
                                                    onChange={(e) => setBidAmount(e.target.value)}
                                                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-10 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-lg"
                                                />
                                            </div>
                                            <button 
                                                onClick={handlePlaceBid} 
                                                disabled={biddingLoading}
                                                className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 disabled:opacity-50"
                                            >
                                                {biddingLoading ? "PLACING..." : "PLACE YOUR BID"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Description & History */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span> Description
                        </h2>
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 leading-relaxed text-slate-600 whitespace-pre-line text-lg mb-10">
                            {auction.description}
                        </div>

                        {/* SELLER REVIEWS SECTION */}
                        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-yellow-400 rounded-full"></span> Seller Reviews
                        </h2>
                        {sellerReviews.reviews.length > 0 ? (
                            <div className="space-y-4">
                                {sellerReviews.reviews.map((review: Review) => (
                                    <div key={review.id || review._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center text-yellow-400 text-lg">
                                                {'★'.repeat(Math.round(review.rating))}
                                                <span className="text-slate-200">{'★'.repeat(Math.max(0, 5 - Math.round(review.rating)))}</span>
                                            </div>
                                            <span className="text-xs text-slate-400 font-bold">
                                                {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-slate-700 font-medium italic">"{review.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center text-slate-400 italic font-bold">
                                This seller has no reviews yet.
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-slate-800 rounded-full"></span> Live Bid History
                        </h2>
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 max-h-[400px] overflow-y-auto space-y-4 custom-scrollbar">
                            {auction.bids && auction.bids.length > 0 ? (
                                auction.bids.map((bid, i) => (
                                    <div key={i} className={`flex justify-between items-center p-4 rounded-2xl border-l-4 transition-all ${i === 0 ? 'bg-blue-50 border-blue-600 shadow-sm' : 'border-slate-100 hover:bg-slate-50'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${i === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                {bid.bidderName ? bid.bidderName.substring(0, 2).toUpperCase() : "AN"}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{bid.bidderName || "Anonymous"}</p>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase font-mono">{new Date(bid.time).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-black ${i === 0 ? 'text-blue-600' : 'text-slate-800'}`}>₹{bid.amount.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-300 italic">No bids yet. Start the action!</div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {paymentSession && (
                <PaymentModal
                    isOpen={true}
                    clientSecret={paymentSession.clientSecret}
                    amount={(auction.currentPrice || auction.startingPrice) * 100}
                    title="Complete Auction Payment"
                    onSuccess={async () => { 
                        await confirmPayment({ 
                            paymentIntentId: paymentSession.paymentIntentId, 
                            auctionId: auction.id 
                        });
                    }}
                    onClose={() => { closePayment(); fetchAuction(); }}
                />
            )}
        </div>
    );
}
