import { useState,useEffect } from "react";
import { getWallet } from "../../api/User/wallet";
import toast from "react-hot-toast";
import type { WalletWithTransactions } from "../../types/wallet";

export default function AdminWallet(){
    const [wallet,setWallet]=useState<WalletWithTransactions | null >(null);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const fetchWallet=async()=>{
            try{
                const res=await getWallet();
                setWallet(res.data)
            }catch (error){
                console.error("Failed to load admin wallet");
                toast.error("Failed to load admin wallet")
            }finally{
                setLoading(false);
            }
        }
        fetchWallet();
    },[]);
    if(loading) return <div className="p-8" > loading Wallet...</div>

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Platform Wallet</h1>
            
            <div className="bg-white p-6 rounded-xl shadow-md border mb-8 flex justify-between items-center">
                <div>
                    <p className="text-gray-500 font-semibold mb-1">Total Balance Collected</p>
                    <h2 className="text-4xl font-extrabold text-blue-600">
                        ₹{wallet?.wallet?.balance || 0}
                    </h2>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <span className="text-blue-600 font-bold">Admin Account</span>
                </div>
            </div>
            <h3 className="text-xl font-bold mb-4">Payment History</h3>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm">
                        <tr>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">Purpose</th>
                            <th className="py-3 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {wallet?.transactions?.map((tx: any) => (
                            <tr key={tx.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                <td className="py-3 px-4">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                                        CREDIT
                                    </span>
                                </td>
                                <td className="py-3 px-4 font-bold">+₹{tx.amount}</td>
                                <td className="py-3 px-4 text-gray-600">{tx.purpose}</td>
                                <td className="py-3 px-4">
                                    <span className="text-xs font-bold text-gray-500 uppercase">{tx.status}</span>
                                </td>
                            </tr>
                        ))}
                        {(!wallet?.transactions || wallet.transactions.length === 0) && (
                            <tr>
                                <td colSpan={5} className="py-6 text-center text-gray-500">No payments received yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}