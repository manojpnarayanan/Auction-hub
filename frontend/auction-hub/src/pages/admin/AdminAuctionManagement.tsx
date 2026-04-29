import { useState, useEffect, useCallback } from "react";
import { getAdminAuctionManagement, deleteAuction, updateAuctionStatus, cancelLiveAuctionAdmin } from "../../api/Admin/adminManage";
import toast from "react-hot-toast";
import Pagination from "../../components/Pagination";
import ConfirmModal from "../../components/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import type { AuctionItem } from "../../types/auction";
import { AxiosError } from "axios";
import ReasonModal from "../../components/ReasonModal";


const AdminAuctions = () => {
    const [auctions, setAuctions] = useState<AuctionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [auctionToDelete, setAuctionToDelete] = useState<string | null>(null)
    const limit = 5;
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [isReasonModalOpen, setIsReasonModalopen] = useState(false);
    const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);
    const [reasonModal, setReasonModal] = useState<'reject' | 'cancel'>('reject')



    const fetchAuctions = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getAdminAuctionManagement(page, limit, searchTerm);
            setAuctions(res.data.data || []);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch auctions");
            const err = error as AxiosError<{ message: string }>
            toast.error(err.response?.data?.message || "Failed to fetch data")
        } finally {
            setLoading(false);
        }
    }, [page, limit, searchTerm]);
    useEffect(() => {
        fetchAuctions();
    }, [page, searchTerm, fetchAuctions]);


    const handleDelete = async (id: string) => {
        setAuctionToDelete(id);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = async () => {
        if (!auctionToDelete) return;
        try {
            await deleteAuction(auctionToDelete);
            toast.success("Auction deleted successfully");
            fetchAuctions();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete Auction")
        }
    }

    const handleStatusUpdate = async (id: string, status: 'active' | 'rejected' | 'approved' | 'cancelled') => {
        if (status === 'rejected') {
            setSelectedAuctionId(id);
            setReasonModal('reject');
            setIsReasonModalopen(true);
            return;
        }

        try {
            await updateAuctionStatus(id, status);
            toast.success(`Auction ${status === 'active' ? 'Approved' : 'Rejected'} successfully`);
            fetchAuctions();
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>
            toast.error(err.response?.data?.message || "Failed to update status")
        }
    }
    const handleRejectConfirm = async (reason: string) => {
        if (!selectedAuctionId) return;
        try {
            await updateAuctionStatus(selectedAuctionId, 'rejected', reason);
            toast.success("Auction rejected with reason");
            setIsReasonModalopen(false);
            fetchAuctions();
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>
            toast.error(err.response?.data?.message || "Failed to reject Auction");
        }
    }

    const handleCancelLiveConfirm = async (reason: string) => {
        if (!selectedAuctionId) return;
        try {
            await cancelLiveAuctionAdmin(selectedAuctionId, reason);
            toast.success("Live auction cancelled with reason");
            setIsReasonModalopen(false);
            fetchAuctions();
        } catch (error:unknown) {
            const err=error as AxiosError<{message:string}>
            toast.error(err.response?.data?.message ||"Failed to cancel live auction");
        }
    }

    return (
        <div className="p-6 bg-[#0d1117] min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-white">Auction Management</h1>
            <div className="bg-[#1c2128] rounded-xl shadow-sm border border-gray-800 overflow-hidden">
                <div className="mb-4" >
                    <input type="text" placeholder="search Auctions..."
                        className="w-full bg-[#0f111a] border border-gray-700 text-gray-300 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
                        value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1) }}
                    />
                </div>
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0d1117] border-b border-gray-700">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Item</th>
                            <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Title</th>
                            <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Date</th>
                            <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Current Price</th>
                            <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                            <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={5} className="p-4 text-center text-gray-400">Loading...</td></tr>
                        ) : auctions.length === 0 ? (
                            <tr><td colSpan={5} className="p-4 text-center text-gray-400">No auctions found.</td></tr>
                        ) : (
                            auctions.map((auction) => (
                                <tr key={auction.id} className="hover:bg-[#0d1117]/50 transition">
                                    <td className="p-4">
                                        <img
                                            src={auction.images?.[0] || auction.image || 'https://via.placeholder.com/50'}
                                            alt="Thumbnail"
                                            className="w-12 h-12 rounded object-cover border border-gray-200"
                                        />
                                    </td>
                                    
                                    <td className="p-4 font-medium text-blue-400 hover:text-blue-300 cursor-pointer underline"
                                        onClick={() => navigate(auction.type === 'live' ? `/live-auction/${auction.id}?adminView=true` : `/auction/${auction.id}?adminView=true`)}>
                                        {auction.title}
                                    </td>
                                    <td className="p-4 text-xs text-gray-400">
                                        {new Date(auction.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="p-4 text-blue-600 font-bold">₹{auction.currentPrice || auction.startingPrice}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs rounded-full font-bold ${auction.status === 'active' ? 'bg-green-100 text-green-700' :
                                            auction.status === 'sold' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {auction.status ? auction.status.toUpperCase() : 'UNKNOWN'}
                                        </span>
                                    </td>
                                    
                                    <td className="p-4 flex flex-wrap gap-2">
                                        
                                        {auction.status === 'pending_cancellation' && (
                                            <div className="flex items-center gap-2 bg-red-500/10 p-2 rounded-lg border border-red-500/20 w-full mb-2">
                                                <div className="flex-1">
                                                    <p className="text-[10px] text-red-400 font-bold uppercase">Cancel Request</p>
                                                    <p className="text-xs text-gray-300 italic">"{auction.cancellationReason}"</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(auction.id, 'cancelled')}
                                                        className="bg-red-600 hover:bg-red-700 text-white text-[10px] px-2 py-1 rounded font-bold transition"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(auction.id, 'active')}
                                                        className="bg-gray-700 hover:bg-gray-600 text-white text-[10px] px-2 py-1 rounded font-bold transition"
                                                    >
                                                        Decline
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {auction.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(auction.id, auction.type === 'live' ? 'approved' : 'active')}
                                                    className="text-green-500 hover:text-green-700 hover:bg-green-500/10 px-3 py-1 rounded transition text-sm font-medium"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(auction.id, 'rejected')}
                                                    className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-500/10 px-3 py-1 rounded transition text-sm font-medium"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {/* Live auctions Control */}
                                        {auction.status === 'active' && auction.type === 'live' && (
                                            <button onClick={() => {
                                                setSelectedAuctionId(auction.id);
                                                setReasonModal('cancel');
                                                setIsReasonModalopen(true);
                                            }}
                                                className="text-orange-500 hover:text-orange-700 hover:bg-orange-500/10 px-3 py-1 rounded transition text-sm font-medium">
                                                Cancel live
                                            </button>
                                        )}
                                        
                                        {auction.status === 'active' && auction.type === 'timed' && (
                                            <button onClick={() => {
                                                setSelectedAuctionId(auction.id);
                                                setReasonModal('reject');
                                                setIsReasonModalopen(true);
                                            }} className="text-purple-500 hover:text-purple-700 hover:bg-purple-500/10 px-3 py-1 rounded transition text-sm font-medium" >
                                                Block
                                            </button>
                                        )}
                                        
                                        <button
                                            onClick={() => handleDelete(auction.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-500/10 px-3 py-1 rounded transition text-sm font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Auction"
                message="Are you sure to delete this auction?"
                confirmText="Yes Delete "
                isDanger={true}
            />
            <ReasonModal
                isOpen={isReasonModalOpen}
                onClose={() => setIsReasonModalopen(false)}
                onConfirm={reasonModal === 'reject' ? handleRejectConfirm : handleCancelLiveConfirm}
                title={reasonModal === 'reject' ? "Reject Auction" : "Cancel live Auction"}
                options={reasonModal === 'reject' ? ["Blurry Images", "Incorrect Category", "Suspecious Item", "Wrong Pricing", "Others"] : ["Emergency", "Violation", "Seller  Request", "Others"]}
            />
        </div>
    );
}


export default AdminAuctions;