import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuctionProductDetails } from "../../api/auctions";
import { placeBid } from "../../api/User/Bidding";
import { socket } from "../../utils/socket";
import { usePayment } from "../../hooks/UsePayment";
import PaymentModal from "../../components/paymentModal";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import toast from "react-hot-toast";


interface Auction{
  id:string,
  title:string,
  description:string,
  currentPrice:number,
  startingPrice:number,
  endDate:string,
  status:string,
  winnerId?:string,
  images?:string[],
  image?:string,
  bids:Array<{
  bidderId:string,
  bidderName:string,
  amount:number,
  time:Date;
}>
paymentStatus:string;
}

export default function AuctionProductDetails() {
  const { id } = useParams();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [biddingLoading, setBiddingLoading] = useState(false);
  const [timeLeft,setTimeLeft]=useState('');
  const currentUser=useSelector((state:any)=>state.auth.user);
  const {paymentSession,initiating,initiatePayment,closePayment}=usePayment();


  const calculateTimeLeft=()=>{
    if(!auction?.endDate) return "";
    const diffrence=+new Date(auction.endDate)- +new Date();
    if(diffrence<=0) return "ended";
    const hours=Math.floor((diffrence/(1000*60*60)));
    const minutes=Math.floor((diffrence/1000/60) % 60);
    const seconds=Math.floor((diffrence/1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s `
  }
  
  useEffect(()=>{
    const timer=setInterval(()=>{
      setTimeLeft(calculateTimeLeft())
    },1000);
    return()=>clearInterval(timer);
  },[auction]);

  useEffect(()=>{
    if(id){
      socket.emit("join_auction",id);
      socket.on("bid_update",(data)=>{
        console.log("New Bid Received:",data);
        
        setAuction((prev)=>{
          if(!prev) return prev;
          return{
            ...prev,
            currentPrice:data.newPrice,
            bids:[data.bid,...prev.bids]
          }
        })
      });
    }
    return ()=>{
      socket.off('bid_update');
    }
    },[id]);

  const fetchAuction = async () => {
    if (!id) return;
    try {
      const res = await getAuctionProductDetails(id);
      const data = res.data.data || res.data;
      setAuction(data);

      if (data.images?.length > 0) {
        setSelectedImage(data.images[0]);
      } else {
        setSelectedImage(data.image || "");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuction();
  }, [id]);

  const handlePlaceBid = async () => {
    if (!auction || !bidAmount || Number(bidAmount) <= (auction.currentPrice || auction.startingPrice)) {
      // alert("Bid must be higher than current price");
      toast.success("Bid must be higher than current price");
      return;
    }

    setBiddingLoading(true);
    try {
      await placeBid(id!, Number(bidAmount));
      toast.success("Bid placed successfully!");
      setBidAmount("");
      fetchAuction(); // Refresh instantly
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Bid Failed");
    } finally {
      setBiddingLoading(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#dbeafe]">Loading...</div>;
  if (!auction) return <div className="min-h-screen flex items-center justify-center bg-[#dbeafe]">Auction not found</div>;

  
  return (
    <div className="min-h-screen bg-[#dbeafe] font-sans text-gray-800 flex flex-col">
      <Navbar/>
          <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-10">

       
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Image Section */}
        <div className="mb-10">
          <div className="w-full aspect-[21/9] bg-[#1a1c23] rounded-xl overflow-hidden shadow-lg flex items-center justify-center mb-4">
            {selectedImage ? (
              <img src={selectedImage} className="h-full object-contain" alt="Main" />
            ) : (
              <div className="text-white/20 text-4xl font-bold">No Image</div>
            )}
          </div>

          {/* Thumbnails */}
          {auction?.images?.length && auction.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 justify-center">
              {auction?.images?.map((img: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-24 h-16 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-[#1da1f2] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Thumb" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Title & Description */}
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-[#1a202c] mb-3">{auction.title}</h1>
          <p className="text-gray-500 leading-relaxed max-w-4xl text-[15px]">
            {auction.description}
          </p>
        </div>

        
                {/* Details Grid */}
        <div className="mb-12 border-b border-gray-300/50 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-10"> {/* Changed to 3 columns */}
            
            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Highest Bid</label>
<p className="text-3xl font-bold text-blue-600">₹{(auction.currentPrice || auction.startingPrice).toLocaleString('en-IN')}</p>            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${auction.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {auction.status.toUpperCase()}
              </span>
            </div>

            {/* Time Remaining (NEW) */}
            <div>
               <label className="block text-xs font-semibold text-gray-500 mb-1">Time Remaining</label>
               <p className="text-xl font-mono font-medium text-gray-800">
                  {auction.status === 'active' ? (timeLeft || "Loading...") : "00h 00m 00s"}
               </p>
               {auction.endDate && (
                  <p className="text-xs text-gray-400 mt-1">Ends: {new Date(auction.endDate).toLocaleString()}</p>
               )}
            </div>

          </div>
        </div>

        {/* Auctioneer & Action */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          
          {/* Left: Input or Status */}
          <div className="w-full md:w-1/2">
            <h3 className="text-xl font-bold text-[#1a202c] mb-4">Place a Bid</h3>
            
            {/* {auction.status === 'sold' && auction.winnerId ? (
    // Show Sold Status
    <div className="bg-green-100 text-green-800 p-4 rounded-lg font-bold border border-green-200">
        🏆 This auction has been sold to User: <span className="underline">{auction.winnerId}</span>
    </div> */}
    {auction.status === 'sold' && auction.winnerId ? (
    <div className="space-y-3">
        <div className="bg-green-100 text-green-800 p-4 rounded-lg font-bold border border-green-200">
            🏆 This auction has been sold to User: <span className="underline">{auction.winnerId}</span>
        </div>
        {/* Pay button — only visible to the winner */}
        {currentUser?.id === auction.winnerId &&auction.paymentStatus !== 'completed' && (
            <button
                onClick={() => initiatePayment(auction.id, (auction.currentPrice || auction.startingPrice) * 100)}
                disabled={initiating}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
                {initiating ? 'Preparing payment...' : 'Pay Now'}
            </button>
        )}
        {auction.paymentStatus === 'completed' && (
          <div className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-center">
        ✅ Payment Completed" 
          </div>
        )}
    </div>

) : auction.status !== 'active' ? (
    <div className="bg-red-100 text-red-800 p-4 rounded-lg font-bold">
        ⛔ This auction has ended.
    </div>
) : (
                // Step 4: Show Input
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Enter Amount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="border p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                        onClick={handlePlaceBid}
                        disabled={biddingLoading}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 whitespace-nowrap"
                    >
                        {biddingLoading ? "Placing..." : "Place Bid"}
                    </button>
                </div>
            )}
          </div>

          {/* Right: Bid History */}
          <div className="w-full md:w-1/2">
             <h3 className="text-xl font-bold text-[#1a202c] mb-4">Recent Bids</h3>
             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 max-h-64 overflow-y-auto">
                {/* Step 5: Optimized History */}
                {auction.bids && auction.bids.length > 0 ? (
                    auction.bids.map((bid: any, i: number) => (
                        <div key={i} className="flex justify-between items-center border-b last:border-0 py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                    BID
                                </div>
                                <span className="font-medium text-gray-700"> {bid.bidderName || 'Anonymous'}</span>
                            </div>
                            <div className="text-right">
<span className="block font-bold text-gray-900">₹{bid.amount.toLocaleString('en-IN')}</span>                                <span className="text-xs text-gray-500">{new Date(bid.time).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center py-4">No bids yet. Be the first!</p>
                )}
             </div>
          </div>

        </div>
      </div>
      </main>
      <Footer/>
      {paymentSession && (
        <PaymentModal
          isOpen={true}
          clientSecret={paymentSession.clientSecret}
          paymentIntentId={paymentSession.paymentIntentId}
          auctionId={auction.id}
          amount={(auction.currentPrice || auction.startingPrice) * 100}
          onSuccess={() => { closePayment(); fetchAuction(); }}
          onClose={closePayment}
        />
      )}
    </div>
  );
}