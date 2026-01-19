import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuctionProductDetails } from "../../api/auctions";

export default function AuctionProductDetails() {
  const { id } = useParams();
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchAuction = async () => {
      if (!id) return;
      try {
        const res = await getAuctionProductDetails(id);
        
        setAuction(res.data.data);
        if (res.data.data.images?.length > 0) {
           setSelectedImage(res.data.data.images[0]);
        } else {
           setSelectedImage(res.data.data.image || "");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuction();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#dbeafe]">Loading...</div>;
  if (!auction) return <div className="min-h-screen flex items-center justify-center bg-[#dbeafe]">Auction not found</div>;

  const formatDate = (dateString: string) => {
    if (!dateString) return "July 1, 2024"; 
    return new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#dbeafe] font-sans text-gray-800">
      
      {/* 1. Header (Exact Match to Dashboard) */}
      <header className="bg-[#1da1f2] text-white py-3 px-6 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-8">
                <h1 className="text-2xl font-bold italic" style={{ fontFamily: "cursive" }}>Auction Hub</h1>
                <nav className="hidden md:flex gap-6 text-sm font-medium">
                  <span className="cursor-pointer hover:text-white/80">Home</span>
                  <span className="cursor-pointer hover:text-white/80">Categories</span>
                  <span className="cursor-pointer hover:text-white/80">My Bids</span>
                  <span className="cursor-pointer hover:text-white/80">Watchlist</span>
                </nav>
            </div>
            {/* Simple Icons to match alignment */}
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/50"></div>
            </div>
        </div>
      </header>
      
      <div className="max-w-5xl mx-auto px-6 py-10">
        
        {/* 2. Image Section (Main + Thumbnails) */}
        <div className="mb-10">
            {/* Main Image Box */}
            <div className="w-full aspect-[21/9] bg-[#1a1c23] rounded-xl overflow-hidden shadow-lg flex items-center justify-center mb-4">
                 {selectedImage ? (
                    <img src={selectedImage} className="h-full object-contain" alt="Main" />
                 ) : (
                    <div className="text-white/20 text-4xl font-bold">No Image</div>
                 )}
            </div>

            {/* Thumbnails Row */}
            {auction.images?.length > 1 && (
               <div className="flex gap-4 overflow-x-auto pb-2 justify-center">
                  {auction.images.map((img: string, idx: number) => (
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

        {/* 3. Title & Description */}
        <div className="mb-12">
            <h1 className="text-3xl font-extrabold text-[#1a202c] mb-3">{auction.title}</h1>
            <p className="text-gray-500 leading-relaxed max-w-4xl text-[15px]">
                {auction.description}
            </p>
        </div>

        {/* 4. Details Grid */}
        <div className="mb-12 border-b border-gray-300/50 pb-12">
            <h3 className="text-xl font-bold text-[#1a202c] mb-8">Auction Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-20">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Reserved Price</label>
                    <p className="text-lg font-bold text-[#1a202c]">${auction.startingPrice}</p>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Highest Bid Price</label>
                    <p className="text-2xl font-bold text-blue-600">${auction.currentPrice || auction.startingPrice}</p>
                </div>
                <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-1">Auction Start Date</label>
                     <p className="text-md font-bold text-[#1a202c] opacity-80">{formatDate(auction.createdAt)}</p>
                </div>
                <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-1">Auction End Date</label>
                     <p className="text-md font-bold text-[#1a202c] opacity-80">{formatDate(auction.endDate)}</p>
                </div>
            </div>
        </div>

        {/* 5. Auctioneer & Action */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="w-full">
                <h3 className="text-xl font-bold text-[#1a202c] mb-8">Auctioneer Details</h3>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Auctioneer Name</label>
                    <p className="text-lg font-bold text-[#1a202c]">Verified Seller</p>
                </div>
                
            </div>

            <div>
                <button className="bg-[#1da1f2] hover:bg-blue-600 text-white font-bold py-3 px-12 rounded-lg shadow-md transition-all whitespace-nowrap">
                    Place Bid
                </button>
            </div>
        </div>

        {/* 6. Footer */}
        <footer className="mt-20 pt-10 border-t border-gray-300/30 text-center text-gray-400 text-sm">
            <div className="flex justify-center gap-8 mb-4 text-[#718096]">
                <span>About</span>
                <span>Contact</span>
                <span>Privacy Policy</span>
            </div>
            <p>@2024 Auction Hub. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
}