import { useState, useEffect } from "react";
import { getAllDisputesAPI, resolveDisputesAPI } from "../../api/Admin/adminDisputes";
import Pagination from "../../components/Pagination";
import InfoModal from "../../components/InfoModal";
import type { AxiosError } from "axios";


interface UserRef {
    _id: string;
    name: string;
    email?: string;
}
interface AuctionRef{
    _id:string;
    title:string;
}

interface DisputeItem {
    id: string;
    auctionId: AuctionRef;
    buyerId: UserRef;
    sellerId: UserRef;
    reason: string;
    status: 'open' | 'under_review' | 'resolved_refunded' | 'resolved_rejected';
    adminNote?: string;
    evidence?:string;
    createdAt: string;
}

export default function AdminDisputes() {
    const [disputes, setDisputes] = useState<DisputeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterStatus, setFilterStatus] = useState('all');
    const [resolvingId, setResolvingId] = useState<string | null>(null);
    const [resolutionAction, setResolutionAction] = useState<'refund' | 'reject'>('refund');
    const [adminNote, setAdminNote] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [infoModalContent, setInfoModalContent] = useState({ title: "", message: "" });
    const [previewImage,setPreviewImage]=useState<string | null>(null);

    const fetchDisputes = async () => {
        try {
            setLoading(true);
            const res = await getAllDisputesAPI(currentPage, 10, filterStatus);
            setDisputes(res.data.data?.disputes || []);
            setTotalPages(Math.ceil((res.data.data?.total || 1) / 10));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisputes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filterStatus]);

    const handleResolve = async () => {
        if (!resolvingId || !adminNote.trim()) return;
        try {
            setActionLoading(true);
            await resolveDisputesAPI(resolvingId, resolutionAction, adminNote);

            setInfoModalContent({ title: "Resolution Successful", message: `Dispute successfully resolved via ${resolutionAction}.` });
            setInfoModalOpen(true);

            setResolvingId(null);
            setAdminNote("");
            fetchDisputes();
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>
            setInfoModalContent({ title: "Resolution Failed", message: err.response?.data?.message || "Failed to resolve dispute" });
            setInfoModalOpen(true);
        } finally {
            setActionLoading(false);
        }
    };

    // const getBuyerName = (buyer: UserRef | string) => typeof buyer === 'string' ? buyer : buyer.name || buyer._id;

    return (
        <div className="text-white min-h-[80vh]">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dispute Management</h1>
                    <p className="text-slate-400 mt-1">Review and resolve buyer-seller conflicts.</p>
                </div>
                <select
                    className="p-2 bg-[#1c2128] border border-gray-700 rounded-lg text-gray-300 outline-none focus:border-blue-500 cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">Check All Disputes</option>
                    <option value="open">Open</option>
                    <option value="resolved_refunded">Refunded (Resolved)</option>
                    <option value="resolved_rejected">Rejected (Resolved)</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : disputes.length === 0 ? (
                <div className="text-center py-20 bg-[#1c2128] rounded-xl border border-gray-800">
                    <p className="text-gray-400 text-lg">No disputes found.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {disputes.map((dispute) => (
                        <div key={dispute.id} className="bg-[#1c2128] p-6 rounded-xl border border-gray-800">
                            <div className="flex justify-between mb-4">
                                <div>
                                    {/* <h3 className="font-bold text-lg text-white">Auction ID: {dispute.auctionid}</h3>
                                    <p className="text-sm text-gray-400 mt-1">User Name: {getBuyerName(dispute.buyerId)}</p> */}
                                    {/* <p className="text-sm text-gray-400 mt-1">Raised by: {getBuyerName(dispute.buyerId)} • on {new Date(dispute.createdAt).toLocaleDateString()}</p> */}
                                    <h3 className="font-bold text-lg text-white">Item: {dispute.auctionId?.title || 'Unknown Item'}</h3>
                                     <p className="text-sm text-gray-400 mt-1">Claim by: <span className="text-blue-400 font-semibold">{dispute.buyerId?.name}</span></p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full h-min ${dispute.status === 'open' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                                    dispute.status === 'resolved_refunded' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' :
                                        dispute.status === 'resolved_rejected' ? 'bg-gray-700 text-gray-300' :
                                            'bg-orange-500/20 text-orange-500 border border-orange-500/30'
                                    }`}>
                                    {dispute.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>

                            <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20 mb-4">
                                <p className="text-sm font-semibold text-red-400 mb-1">Buyer's Complaint:</p>
                                <p className="text-sm text-gray-300">{dispute.reason}</p>
                            </div>

                            {dispute.evidence && (
    <div className="mb-4">
        <button 
            onClick={() => setPreviewImage(dispute.evidence!)}
            className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-400 transition uppercase tracking-widest"
        >
            🖼️ View Evidence Photo
        </button>
    </div>
)}
                            {dispute.status === 'open' ? (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => { setResolvingId(dispute.id); setResolutionAction('refund'); }}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Refund Buyer
                                    </button>
                                    <button
                                        onClick={() => { setResolvingId(dispute.id); setResolutionAction('reject'); }}
                                        className="px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-lg hover:bg-gray-600 border border-gray-600 transition"
                                    >
                                        Reject Issue (Pay Seller)
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                    <p className="text-sm font-semibold text-gray-400 mb-1">Admin Resolution Note:</p>
                                    <p className="text-sm text-gray-300">{dispute.adminNote || 'No note provided.'}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {/* RESOLUTION MODAL */}
            {resolvingId && (
                <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
                    <div className="bg-[#1c2128] rounded-xl shadow-2xl border border-gray-700 p-6 w-full max-w-md relative z-50">
                        <h3 className={`text-xl font-bold mb-4 ${resolutionAction === 'refund' ? 'text-blue-500' : 'text-gray-200'}`}>
                            {resolutionAction === 'refund' ? 'Refund Buyer' : 'Reject Dispute & Pay Seller'}
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            You are about to <strong>{resolutionAction === 'refund' ? 'return the funds to the buyer' : 'release the funds to the seller'}</strong>. This action is Permanent.
                        </p>

                        <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Reason for this decision..."
                            className="w-full bg-[#0d1117] border border-gray-700 text-gray-200 rounded-lg p-3 text-sm min-h-[100px] mb-4 outline-none focus:border-blue-500"
                        />

                        <div className="flex gap-3">
                            <button onClick={() => { setResolvingId(null); setAdminNote(""); }} className="flex-1 py-2 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition">Cancel</button>
                            <button
                                onClick={handleResolve}
                                disabled={actionLoading || !adminNote.trim()}
                                className={`flex-1 py-2 text-white rounded-lg font-semibold disabled:opacity-50 transition ${resolutionAction === 'refund' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-red-600 hover:bg-red-500'}`}
                            >
                                {actionLoading ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* --- PHOTO PREVIEW MODAL --- */}
{previewImage && (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-8" onClick={() => setPreviewImage(null)}>
        <div className="relative max-w-4xl max-h-full">
            <button 
                className="absolute -top-10 right-0 text-white text-xl font-bold hover:text-gray-300"
                onClick={() => setPreviewImage(null)}
            >
                ✕ Close
            </button>
            <img 
                src={previewImage} 
                alt="Evidence" 
                className="rounded-lg shadow-2xl max-w-full max-h-[85vh] object-contain border-4 border-[#1c2128]" 
            />
        </div>
    </div>
)}


            {/* INFO MODAL REPLACING ALERTS */}
            <InfoModal
                isOpen={infoModalOpen}
                onClose={() => setInfoModalOpen(false)}
                title={infoModalContent.title}
                message={infoModalContent.message}
            />
        </div>
    );
}
