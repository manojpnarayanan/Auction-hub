import { useState, useEffect, useCallback } from "react";
import { useSelector, } from "react-redux";
import { getUsers, toggleUserBlock } from "../../api/Admin/adminUser";
import type { User } from '../../types/admin';
import type { RootState } from "../../redux/store";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmationModal";
import DataTable from "../../components/reuseabletable";
import type { Column } from '../../components/reuseabletable';
import type { AxiosError } from "axios";



export default function UserManagement() {
    const { token } = useSelector((state: RootState) => state.auth);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUserData = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await getUsers(page, searchTerm, token);
            // console.log("userManagement",res.data.users);
            setUsers(res.data.data);
            setTotalPages(res.data.totalPages);

        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm, token])
    useEffect(() => {
        const handler = setTimeout(() => fetchUserData(), 500);
        return () => clearTimeout(handler)

    }, [page, searchTerm, token, fetchUserData]);


    const handleBlockToggle = (_userId: string) => {
        const user = users.find(u => u.id === _userId);
        if (user) {
            setSelectedUser(user);
            setIsModalOpen(true);
        }
    }

    const confirmBlockUser = async () => {
        if (!selectedUser || !token) return;
        try {
            const newStatus = !selectedUser.isBlocked;
            console.log("Fromtend", selectedUser.id, newStatus);
            await toggleUserBlock(selectedUser.id, newStatus);
            setUsers(prev => prev.map(user => user.id === selectedUser.id ? { ...user, isBlocked: newStatus } : user));
            toast.success(selectedUser.isBlocked ? "User Unblocked successfully" : "User blocked successfully");
            setIsModalOpen(false);
        } catch (error: unknown) {
            console.error("Failed to update status");
            const err = error as AxiosError<{ message: string }>
            toast.error(err.response?.data?.message || "Failed to update status")
        }
    }
    const columns: Column<User>[] = [
        {
            header: "User Details",
            render: (u) => (
                <div>
                    <div className="text-white font-medium" >{u.name}</div>
                    <div className="text-blue-400 text-xs" >{u.email}</div>
                </div>
            )
        },
        {
            header: "Joined Date",
            render: (u) => <span className="text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</span>
        },
        {
            header: "Status",
            render: (u) => (
                <span className={u.isBlocked ? "text-red-500" : "text-emerald-500"}>{u.isBlocked ? 'Blocked' : "Active"}</span>
            )
        },
        {
            header: "Actions",
            className: 'text-right',
            render: (u) => (
                <button
                    onClick={() => handleBlockToggle(u.id)}
                    className={`${u.isBlocked ? "text-emerald-500" : "text-red-500"} hover:underline font-medium`}
                >
                    {u.isBlocked ? "UnBlock" : "Block"}
                </button>
            )
        }
    ]

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
                    <p className="text-gray-500 text-sm">View and manage platform users</p>
                </div>
            </div>
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-[#161b22] p-4 rounded-xl border border-gray-800">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        className="w-full bg-[#0f111a] border border-gray-700 text-gray-300 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                </div>
            </div>


            <DataTable<User>
                columns={columns}
                data={users}
                isLoading={loading}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                keyExtractor={(u) => u.id}
                emptyMessage="No users found matching your search"
            />


            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmBlockUser}
                title={selectedUser?.isBlocked ? "Unblock User" : "Block User"}
                message={selectedUser?.isBlocked ? "This user get access to platForm" : "This user will be logged out and banned"}
                confirmText={selectedUser?.isBlocked ? "Yes , UnBlock" : "Yes Block"}
                isDanger={!selectedUser?.isBlocked}
            />
        </div>
    );
}