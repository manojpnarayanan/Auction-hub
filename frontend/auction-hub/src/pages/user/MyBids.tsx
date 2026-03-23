import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getMyBids } from "../../api/User/Bidding";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import type { AuctionItem } from "../../types/auction";

interface MyBidItem{
    auction:AuctionItem;
    myHighestBid:number;
    lastBidTime:string | Date;
    status:'winning' | 'outbid' | 'won' | 'lost'
}

export default function MyBids() {
    const navigate = useNavigate();
    const [myBids, setMyBids] = useState<MyBidItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage,setCurrentPage]=useState(1);
    const [totalPages,setTotalPages]=useState(1);
    const limit=4;

    useEffect(() => {
        const fetchBids = async () => {
            try {
                setLoading(true);
                const res =await getMyBids(currentPage,limit);
                console.log("API response",res);
                setMyBids( res?.data?.data || []);
                setTotalPages(Math.ceil(res.data.total/limit));
            } catch (error) {
                console.error("Failed to fetch bids", error);
                setMyBids([]);
            } finally {
                setLoading(false);
            }
        }
        fetchBids();
    }, [currentPage]);
    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">My Bids</h2>
                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : myBids.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">You haven't placed any bids yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myBids.map((item: MyBidItem) => (
                            <div key={item.auction.id}
                                onClick={() => navigate(item.auction.type === 'live' ? `/live-auction/${item.auction.id}` : `/auction/${item.auction.id}`)}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:shadow-md transition">
                                <img
                                    src={item.auction.images?.[0] || "https://via.placeholder.com/150"}
                                    alt={item.auction.title}
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-lg text-gray-900 line-clamp-1">{item.auction.title}</h4>
                                            <span className={`px-2 py-1 text-xs rounded-full font-bold ${item.status === 'winning' ? 'bg-green-100 text-green-700' :
                                                    item.status === 'outbid' ? 'bg-orange-100 text-orange-700' :
                                                        item.status === 'won' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-red-100 text-red-700'
                                                }`}>
                                                {item.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.auction.description}</p>
                                    </div>

                                    <div className="flex justify-between items-end mt-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Your Bid</p>
<p className="font-bold text-xl text-gray-900">₹{item.myHighestBid?.toLocaleString('en-IN')}</p>                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Current Price</p>
<p className="font-bold text-xl text-blue-600">₹{item.auction.currentPrice?.toLocaleString('en-IN')}</p>                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            />
            <Footer />
        </div>
    );
}