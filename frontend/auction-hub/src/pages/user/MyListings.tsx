import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getMyAuctions, requestCancellation } from "../../api/auctions";
import CreateAuctionModal from "../../components/CreateAuctionModal";
import ReasonModal from "../../components/ReasonModal";
import { useNavigate, useLocation } from "react-router-dom";
import type { AuctionItem } from "../../types/auction";
import Pagination from "../../components/Pagination";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import InfoModal from "../../components/InfoModal";
import { ROUTES } from '../../Constants/routes'


export default function MyListings() {
    const navigate = useNavigate();
    const location = useLocation();
    const [myAuctions, setMyAuctions] = useState<AuctionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 6;
    const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
    const [auctionToCancel, setAuctionToCancel] = useState<string | null>(null);
    const [viewReason, setViewReason] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string>('');


    useEffect(() => {
        setIsModalOpen(false);
        setSelectedAuction(null);
    }, [location]);

    const fetchMyListings = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getMyAuctions(currentPage, limit);
            setMyAuctions(res.data.data || []);
            setTotalPages(res.data.totalPages);
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>
            console.error("Failed to fetch my listings");
            toast.error(err?.response?.data?.message || "Failed to fetch my listings")
        } finally {
            setLoading(false);
        }
    }, [currentPage, limit])
    useEffect(() => {
        fetchMyListings();
    }, [currentPage, fetchMyListings]);

    const handleRequestCancellation = (id: string) => {
        setAuctionToCancel(id);
        setIsReasonModalOpen(true);
    };

    const handleCancelConfirm = async (reason: string) => {
        if (!auctionToCancel) return;
        try {
            await requestCancellation(auctionToCancel, reason);
            toast.success("Cancellation request sent to admin");
            setIsReasonModalOpen(false);
            fetchMyListings();
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>
            toast.error(err.response?.data?.message || "Failed to send request");
        }
    };
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
                        {myAuctions.map((auction: AuctionItem) => (
                            <div key={auction.id}

                                onClick={() => navigate(auction.type === 'live' ? ROUTES.LIVE_AUCTION.replace(':id', auction.id) : ROUTES.AUCTION_DETAILS.replace(':id', auction.id))}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition group">
                                <div className="h-48 bg-gray-200 overflow-hidden relative">
                                    {auction.images?.[0] ? (
                                        <img src={auction.images?.[0]} alt={auction.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
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
                                    <p className="text-blue-600 font-bold text-xl">₹{auction.startingPrice}</p>
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                                        <div className="text-xs text-gray-500">
                                            {auction.type === 'live' ? '📡 Live Auction' : '⏳ Timed Auction'}
                                        </div>

                                        <div className="flex gap-2">

                                            {(auction.status === 'active' || auction.status === 'approved') && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRequestCancellation(auction.id);
                                                    }}
                                                    className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-4 py-1.5 rounded-lg transition font-medium"
                                                >
                                                    Request Cancel
                                                </button>
                                            )}


                                            {(auction.status === 'rejected' || auction.status === 'cancelled') && (
                                                <span
                                                    title={auction.rejectionReason}
                                                    className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold cursor-help flex items-center gap-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedReason(auction.cancellationReason || auction.rejectionReason || "No reason attached")
                                                        setViewReason(true);
                                                    }}
                                                >
                                                    View Reason ⚠️
                                                </span>
                                            )}


                                            {(auction.status === 'pending' || auction.status === 'rejected') && (
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
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            {isModalOpen && (
                <CreateAuctionModal onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchMyListings}
                    initialData={selectedAuction || undefined}
                />
            )}
            <ReasonModal
                isOpen={isReasonModalOpen}
                onClose={() => setIsReasonModalOpen(false)}
                onConfirm={handleCancelConfirm}
                title="Reason for Cancellation"
                options={["High Shipping Cost", "Item Damaged", "Found Better Buyer", "Mistake in Listing", "Others"]}
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                variant='light'
            />
            <InfoModal
                isOpen={viewReason}
                onClose={() => setViewReason(false)}
                title="Auction Rejected"
                message={selectedReason}
            />
            <Footer />
        </div>
    );
}