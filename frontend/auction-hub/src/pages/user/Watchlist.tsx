import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWatchlist, removeFromWatchlist } from "../../api/User/watchlist";
import type { watchlistDTO } from "../../types/watchlist";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";



const Watchlist = () => {
    const [auctions, setAuctions] = useState<watchlistDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchWatchlist = async () => {
        try {
            const res = await getWatchlist();
            setAuctions(res.data.data);
        } catch {
            toast.error("Failed to load watchlist")
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchWatchlist() }, []);

    const handleRemove = async (auctionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await removeFromWatchlist(auctionId);
            setAuctions(prev => prev.filter(a => a.id !== auctionId));
            toast.success("Removed from watchlist")
        } catch {
            toast.error("Failed to remove ")
        }
    };
if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#dbeafe]">
        <p className="text-gray-500 text-lg">Loading watchlist...</p>
    </div>
);

    return (
    <div className="min-h-screen bg-[#dbeafe] flex flex-col">
        <Navbar />
        <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-10">
            <h1 className="text-3xl font-extrabold text-[#1a202c] mb-8">❤️ My Watchlist</h1>

            {auctions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-gray-500 text-lg mb-4">Your watchlist is empty.</p>
                    <button
                        onClick={() => navigate("/auctions")}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                        Browse Auctions
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.map(auction => (
                        <div
                            key={auction.id}
                            onClick={() => navigate(`/auction/${auction.id}`)}
                            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow border border-gray-100"
                        >
                            <div className="w-full h-48 bg-[#1a1c23] flex items-center justify-center overflow-hidden">
                                {auction.images?.[0] ? (
                                    <img src={auction.images[0]} alt={auction.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white/30 text-2xl font-bold">No Image</span>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-[#1a202c] mb-2 truncate">{auction.title}</h3>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-500">Current Price</span>
                                    <span className="text-blue-600 font-bold">₹{auction.currentPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm text-gray-500">Ends</span>
                                    <span className="text-sm text-gray-700">{new Date(auction.endDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${auction.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {auction.status.toUpperCase()}
                                    </span>
                                    <button
                                        onClick={(e) => handleRemove(auction.id, e)}
                                        className="text-red-400 hover:text-red-600 font-semibold text-sm transition"
                                    >
                                        ♥ Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
        <Footer />
    </div>
);

}

export default Watchlist