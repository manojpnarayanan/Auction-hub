import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { WalletWithTransactions } from "../../types/wallet";
import DataTable from "../../components/reuseabletable";
import type { Column } from "../../components/reuseabletable";
import type { TransactionItem } from "../../types/transaction";
import { getPendingRelease, releasePayment, getWallet } from "../../api/Admin/adminWallet";
import API from "../../api/axiosInstances";
import type { AxiosError } from "axios";


export default function AdminWallet() {
    const [wallet, setWallet] = useState<WalletWithTransactions | null>(null);
    const [pendingRelease, setPendingRelease] = useState<TransactionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
    const [releasing, setReleasing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [purposeFilter, setPurposeFilter] = useState<string>('');
    const pageSize = 10;

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const [walletRes, pendingRes] = await Promise.all([
                    getWallet(currentPage, pageSize,purposeFilter),
                    getPendingRelease()
                ]);
                setWallet(walletRes.data.data);
                setTotalTransactions(walletRes.data.data.total)
                setPendingRelease(pendingRes.data.data);
                
            } catch (error: unknown) {
                console.error("Failed to load admin wallet");
                const err = error as AxiosError<{ message: string }>
                toast.error(err.response?.data?.message || "Failed to load admin wallet")
            } finally {
                setLoading(false);
            }
        }
        fetchWallet();
    }, [currentPage,purposeFilter]);
    if (loading) return <div className="p-8" > loading Wallet...</div>

    const handleRelease = async () => {
        
        if (selectedTx?.commissionPercent === undefined) {
            toast.error("Commission percent not seeen in plan");
            return;
        }
        if (!selectedTx || !selectedTx.auctionId || releasing) return;
        setReleasing(true);
        try {
            const auctionRes = await API.get(`/auctions/${selectedTx.auctionId}`);
            // console.log("Auction APi Response",auctionRes.data)
            const sellerId = auctionRes.data?.data?.sellerId?._id ||
                auctionRes.data?.data?.sellerId ||
                auctionRes.data?.auction?.sellerId?._id ||
                auctionRes.data?.auction?.sellerId;

            const rate = selectedTx.commissionPercent;

            await releasePayment({
                transactionId: selectedTx.id,
                auctionId: selectedTx.auctionId,
                sellerId: sellerId as string,
                amount: selectedTx.amount,
                commissionPercent: rate,
                sellerAmount: selectedTx.amount - (selectedTx.amount * (rate / 100))
            });
            toast.success("Funds released to user successfully");
            setPendingRelease(prev => prev.filter(r => r.id !== selectedTx.id));
            setIsConfirmOpen(false);

        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>
            toast.error(err.response?.data.message || "failed to release funds")
        } finally {
            setReleasing(false);
        }
    }

    const columns: Column<TransactionItem>[] = [
        {
            header: "Auction",
            render: (tx) => <div className="text-blue-400 text-sm truncate max-w-[150px]">{tx.auctionTitle || ""} </div>
        },
        {
            header: "User",
            render: (tx) => <div className="text-gray-300 text-sm">{tx.userName || "-"}</div>
        },
        {
            header: "Date",
            render: (tx) => <div className="text-gray-400 text-sm">{new Date(tx.createdAt).toLocaleDateString()}</div>
        },
        {
            header: "Type",
            render: (tx) => (
                <span className={`${tx.type === 'credit' ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800' : 'bg-red-900/40 text-red-400 border-red-800'} border px-2 py-1 rounded text-xs font-bold uppercase`}>
                    {tx.type}
                </span>
            )
        },
        {
            header: "Amount",
            render: (tx) => <div className={`${tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'} font-bold`}>
                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
            </div>
        },
        {
            header: "Purpose",
            render: (tx) => <div className="text-gray-400 text-sm max-w-[250px] truncate">{tx.purpose}</div>
        }
    ];

    const pendingColumn: Column<TransactionItem>[] = [
        ...columns.filter(c => c.header !== "Type" && c.header !== "Status"),
        {
            header: "Actions",
            render: (tx) => (
                <button onClick={() => { setSelectedTx(tx); setIsConfirmOpen(true) }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-3 rounded text-sm transition"
                >
                    Release Funds
                </button>
            )
        }
    ]

    return (
        <div>
            {/* Header Section Matches Dark Theme */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Platform Wallet</h1>
                    <p className="text-gray-500 text-sm">Monitor all platform transactions and escrow holds</p>
                </div>

                {/* Stats Card */}
                <div className="bg-[#161b22] border border-gray-800 p-4 rounded-xl shadow-lg">
                    <p className="text-gray-400 text-sm font-medium mb-1">Total Balance Collected</p>
                    <p className="text-2xl font-bold text-blue-400">
                        ₹{wallet?.wallet?.balance || 0}
                    </p>
                </div>
            </div>

            {/* PENDING RELEASES ROW */}
            <h3 className="text-xl font-bold text-amber-500 mb-4">Pending Payment Releases</h3>
            <div className="mb-12">
                <DataTable<TransactionItem>
                    columns={pendingColumn}
                    data={pendingRelease}
                    isLoading={loading}
                    page={currentPage}
                    totalPages={Math.ceil(totalTransactions / pageSize)}
                    onPageChange={(page) => setCurrentPage(page)}
                    keyExtractor={(tx) => tx.id || String(Math.random())}
                    emptyMessage="No payments currently held in escrow."
                />
            </div>
           
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Payment History</h3>

               
                <select
                    value={purposeFilter}
                    onChange={(e) => {
                        setPurposeFilter(e.target.value);
                        setCurrentPage(1); 
                    }}
                    className="bg-[#161b22] border border-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition"
                >
                    <option value="">All Transactions</option>
                    <option value="commission">Commissions</option>
                    <option value="subscription_payment">Subscription Revenue</option>
                    <option value="auction_payment">Auction Payments</option>
                    <option value="refund">Refunds</option>
                </select>
            </div>


           
            <DataTable<TransactionItem>
                columns={columns}
                data={wallet?.transactions || []}
                isLoading={loading}
                page={currentPage}
                totalPages={Math.ceil(totalTransactions / pageSize)}
                onPageChange={(page) => setCurrentPage(page)}
                keyExtractor={(tx) => tx.id || String(Math.random())}
                emptyMessage="No payments received yet."
            />

            {/* Confirmation Modal */}
            {isConfirmOpen && selectedTx && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Confirm Fund Release?</h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            You are about to release <span className="text-white font-bold">₹{selectedTx.amount}</span> to the seller.
                            Platform will keep<span className="text-white font-bold">{selectedTx.commissionPercent}%</span> commission. This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                disabled={releasing}
                                onClick={handleRelease}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                            >
                                {releasing ? "Releasing..." : "Yes, Release"}
                            </button>
                            <button
                                onClick={() => setIsConfirmOpen(false)}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );


}