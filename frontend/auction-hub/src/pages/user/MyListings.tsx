import { useState,useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getMyAuctions } from "../../api/auctions";
import CreateAuctionModal from "../../components/CreateAuctionModal";
import { useNavigate,useLocation } from "react-router-dom";



export default function MyListings(){
    const navigate=useNavigate();
    const location=useLocation();
    const [myAuctions,setMyAuctions]=useState<any[]>([]);
    const [loading,setLoading]=useState(true);
    const [isModalOpen,setIsModalOpen]=useState(false);
    const [selectedAuction,setSelectedAuction]=useState<any>(null);

    useEffect(()=>{
        setIsModalOpen(false);
        setSelectedAuction(null);
    },[location]);

    const fetchMyListings=async()=>{
        try{
            const res=await getMyAuctions();
            setMyAuctions(res.data.data || [] );
        }catch(error){
            console.error("Failed to fetch my listings");
        }finally
        {
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchMyListings();
    },[]);
    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">My Listings</h2>
                    <button onClick={() => {
                        setSelectedAuction(null);
                        setIsModalOpen(true)
                    }}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-md flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add New Listing
                    </button>
                </div>
                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : myAuctions.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">You haven't listed anything yet.</p>
                        <p className="text-gray-400 text-sm mt-1">Start selling by adding your first auction!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myAuctions.map((auction: any) => (
                            <div key={auction.id}
                                onClick={() => navigate(`/auction/${auction.id}`)}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition group">
                                <div className="h-48 bg-gray-200 overflow-hidden relative">
                                    {auction.images?.[0] || auction.image ? (
                                        <img src={auction.images?.[0] || auction.image} alt={auction.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-2.5 py-1 text-xs rounded-full font-bold shadow-sm ${auction.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {auction.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-gray-900 text-lg mb-1 truncate">{auction.title}</h4>
                                    <p className="text-blue-600 font-bold text-xl">${auction.startingPrice}</p>
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                                        <div className="text-xs text-gray-500">
                                            {auction.type === 'live' ? '📡 Live Auction' : '⏳ Timed Auction'}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedAuction(auction);
                                                setIsModalOpen(true);
                                            }}
                                            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg transition font-medium"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
            {isModalOpen && (
                <CreateAuctionModal onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchMyListings} // Refresh list after create/edit
                    initialData={selectedAuction}
                />
            )}
        </div>
    );
}