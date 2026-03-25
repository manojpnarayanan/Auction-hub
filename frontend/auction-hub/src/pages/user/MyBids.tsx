import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getMyBids } from "../../api/User/Bidding";
import { confirmDeliveryAPI, raiseDisputeAPI } from '../../api/User/dispute'
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import type { AuctionItem } from "../../types/auction";

interface MyBidItem {
    auction: AuctionItem;
    myHighestBid: number;
    lastBidTime: string | Date;
    status: 'winning' | 'outbid' | 'won' | 'lost';
}

export default function MyBids() {
    const navigate = useNavigate();
    const [myBids, setMyBids] = useState<MyBidItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 4;

    // Escrow States
    const [confirmId, setConfirmId] = useState<string | null>(null);
    const [disputeId, setDisputeId] = useState<string | null>(null);
    const [disputeReason, setDisputeReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const fetchBids = async () => {
        try {
            setLoading(true);
            const res = await getMyBids(currentPage, limit);
            setMyBids(res?.data?.data || []);
            setTotalPages(Math.ceil(res.data.total / limit));
        } catch (error) {
            console.error("Failed to fetch bids", error);
            setMyBids([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBids();
    }, [currentPage]);

    const handleConfirmDelivery = async () => {
        if (!confirmId) return;
        try {
            setActionLoading(true);
            await confirmDeliveryAPI(confirmId);
            alert("Delivery confirmed! Funds have been released to the seller.");
            setConfirmId(null);
            fetchBids(); // Refresh to update status UI
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to confirm delivery");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRaiseDispute = async () => {
        if (!disputeId || !disputeReason.trim()) return;
        try {
            setActionLoading(true);
            await raiseDisputeAPI(disputeId, disputeReason);
            alert("Dispute raised. Staff will review the issue and contact you.");
            setDisputeId(null);
            setDisputeReason('');
            fetchBids(); // Refresh to update status UI
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to raise dispute");
        } finally {
            setActionLoading(false);
        }
    };

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
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 cursor-pointer hover:shadow-md transition">
                                <div className="flex gap-4">
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
                                                <p className="font-bold text-xl text-gray-900">₹{item.myHighestBid?.toLocaleString('en-IN')}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 uppercase font-semibold">Current Price</p>
                                                <p className="font-bold text-xl text-blue-600">₹{item.auction.currentPrice?.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* --- ESCROW ACTIONS SECTION --- */}
                                {item.status === 'won' && item.auction.paymentStatus === 'completed' && item.auction.deliveryStatus === 'pending_delivery' && (
                                    <div className="mt-2 pt-4 border-t border-gray-100 flex gap-3">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setConfirmId(item.auction.id); }} 
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold text-sm transition">
                                            Confirm Receipt
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setDisputeId(item.auction.id); }} 
                                            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2 rounded-lg font-semibold text-sm transition">
                                            Report Problem
                                        </button>
                                    </div>
                                )}
                                {item.status === 'won' && item.auction.deliveryStatus === 'disputed' && (
                                    <div className="mt-2 pt-4 border-t border-gray-100">
                                        <div className="bg-orange-50 text-orange-700 text-sm font-semibold p-2 rounded-lg text-center border border-orange-200">
                                            Dispute Under Review by Admin
                                        </div>
                                    </div>
                                )}
                                {item.status === 'won' && item.auction.deliveryStatus === 'delivered' && (
                                    <div className="mt-2 pt-4 border-t border-gray-100">
                                        <div className="bg-gray-50 text-gray-600 text-sm font-semibold p-2 rounded-lg text-center border border-gray-200">
                                            Delivery Confirmed & Funds Released
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            <Footer />

            {/* CONFIRM DELIVERY MODAL */}
            {confirmId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
                        <h3 className="text-xl font-bold mb-4">Confirm Delivery?</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            Only confirm if you have received the item and are satisfied. This will permanently release your payment to the seller.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmId(null)} className="flex-1 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-semibold" disabled={actionLoading}>Cancel</button>
                            <button onClick={handleConfirmDelivery} className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 font-semibold" disabled={actionLoading}>
                                {actionLoading ? 'Processing...' : 'Yes, Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* RAISE DISPUTE MODAL */}
            {disputeId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-red-600 mb-4">Report a Problem</h3>
                        <p className="text-gray-600 mb-4 text-sm">
                            Did you not receive your item? Or is it severely damaged? Explain the issue below. We will hold your funds safely until this is resolved.
                        </p>
                        <textarea
                            value={disputeReason}
                            onChange={(e) => setDisputeReason(e.target.value)}
                            placeholder="Please explain the issue in detail..."
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[100px] mb-4 focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                        <div className="flex gap-3">
                            <button onClick={() => { setDisputeId(null); setDisputeReason(''); }} className="flex-1 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-semibold" disabled={actionLoading}>Cancel</button>
                            <button onClick={handleRaiseDispute} className="flex-1 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 font-semibold opacity-disabled" disabled={!disputeReason.trim() || actionLoading}>
                                {actionLoading ? 'Submitting...' : 'Submit Dispute'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
