import { useEffect, useState } from "react";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../../api/Admin/Category";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmationModal";
import type { Column } from "../../components/reuseabletable";
import DataTable from "../../components/reuseabletable";


interface Category {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
}

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: "", description: "" });
    const [msg, setMsg] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debounceTerm, setDebounceTerm] = useState("")
    const [totalPages, setTotalPages] = useState(1);
    const limit = 2
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || "1");

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebounceTerm(searchTerm);
        }, 500)
        return () => clearTimeout(timerId);
    }, [searchTerm])

    useEffect(() => {
        fetchCategories();
    }, [page, debounceTerm])

    const fetchCategories = async () => {
        try {
            const data = await getCategories(page, limit, debounceTerm);
            console.log(data);
            setCategories(data.categories);
            setTotalPages(Math.ceil(data.total / limit));
        } catch (error) {
            console.error("Failed to fetch Categories", error);
        }
    }

    const handleDelete = async (id: string) => {
        setCategoryToDelete(id);
        setIsDeleteModalOpen(true);
    }
    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        try {
            await deleteCategory(categoryToDelete);
            toast.success("Category deleted successfully");
            fetchCategories();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete category");
        }
    }
    const handleEdit = async (category: Category) => {
        setEditingId(category.id)
        setForm({ name: category.name, description: category.description });
        setIsCreating(true);
        setMsg("");
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) {
            throw new Error("Category name cannot be empty or spaces only");
            return;
        }
        try {
            if (editingId) {
                await updateCategory(editingId, form);
                toast.success("Category updated successfully")
            } else {
                await createCategory(form);
                toast.success("Category created Successfully");

            }
            setForm({ name: "", description: "" });
            setIsCreating(false);
            setEditingId(null);
            fetchCategories()
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Failed to create category"
            toast.error(errorMessage);
        }
    }
    const columns: Column<Category>[] = [
        {
            header: "Name",
            render: (cat) =><div className="text-white font-medium">{cat.name}</div>
      },
      {
        header:"Description",
        render:(cat)=><div className="text-gray-400 text-sm">{cat.description || "-"}</div>
      },{
        header:"Status",
        render:(cat)=><span className={cat.isActive ? "text-emerald-500" : "text-red-500"}>
                    {cat.isActive ? "Active" : "Inactive"}
                </span>
      },{
        header:"Actions",
        render:(cat)=> (
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => handleEdit(cat)} 
                        className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => handleDelete(cat.id)} 
                        className="text-red-500 hover:text-red-400 font-medium hover:underline transition"
                    >
                        Delete
                    </button>
                </div>
            )
      }
    ]
    // return (
    //     <div className="p-6">
    //         <div className="flex justify-between items-center mb-6">
    //             <h1 className="text-2xl font-bold text-gray-800">Manage Categories</h1>
    //             <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }} placeholder="Search here......" className="border px-3 py-2 rounded-lg" />
    //             <button
    //                 onClick={() => {
    //                     setIsCreating(!isCreating);
    //                     setEditingId(null);
    //                     setForm({ name: '', description: "" });
    //                 }}
    //                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
    //             >
    //                 {isCreating ? "Cancel" : "+ Add Category"}
    //             </button>
    //         </div>
    //         {msg && <div className="mb-4 p-3 bg-gray-100 rounded text-center font-medium">{msg}</div>}
    //         {isCreating && (
    //             <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-md">
    //                 <div className="mb-4">
    //                     <label className="block text-sm font-bold text-gray-700 mb-1">Category Name</label>
    //                     <input
    //                         type="text"
    //                         required
    //                         value={form.name}
    //                         onChange={e => setForm({ ...form, name: e.target.value })}
    //                         className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
    //                         placeholder="e.g. Vintage"
    //                     />
    //                 </div>
    //                 <div className="mb-4">
    //                     <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
    //                     <textarea
    //                         value={form.description}
    //                         onChange={e => setForm({ ...form, description: e.target.value })}
    //                         className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
    //                         placeholder="Optional description..."
    //                     />
    //                 </div>
    //                 <button className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700">
    //                     {editingId ? "Update Category" : "Create Category"}
    //                 </button>
    //             </form>
    //         )}
    //         {/* Placeholder for List */}
    //         {/* <div className="mt-8 text-gray-400 text-center border-2 border-dashed border-gray-200 rounded-xl p-10">
    //     List of categories will appear here...
    //   </div>
    //    */}
    //         {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    //             <table className="w-full text-left border-collapse">
    //                 <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
    //                     <tr>
    //                         <th className="px-6 py-4">Name</th>
    //                         <th className="px-6 py-4">Description</th>
    //                         <th className="px-6 py-4">Status</th>
    //                         <th className="px-6 py-4">Actions</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody className="divide-y divide-gray-100">
    //                     {categories.length > 0 ? (
    //                         categories.map((cat) => (
    //                             <tr key={cat.id} className="hover:bg-gray-50 transition">
    //                                 <td className="px-6 py-4 font-bold text-gray-800">{cat.name}</td>
    //                                 <td className="px-6 py-4 text-gray-500 text-sm">{cat.description || "-"}</td>
    //                                 <td className="px-6 py-4">
    //                                     <span className={`px-2 py-1 rounded text-xs font-bold ${cat.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
    //                                         {cat.isActive ? "Active" : "Inactive"}
    //                                     </span>
    //                                 </td>
    //                                 <td className="px-6 py-4">
    //                                     <button onClick={() => handleEdit(cat)} className="text-blue-500 hover:text-blue-700 text-sm font-bold mr-3">Edit</button>
    //                                     <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">Delete</button>
    //                                 </td>
    //                             </tr>
    //                         ))
    //                     ) : (
    //                         <tr>
    //                             <td colSpan={4} className="text-center py-8 text-gray-400">
    //                                 No categories found. Create one!
    //                             </td>
    //                         </tr>
    //                     )}
    //                 </tbody>
    //             </table>
    //         </div>
    //         <Pagination
    //             currentPage={page}
    //             totalPages={totalPages}
    //             onPageChange={(n) => setSearchParams({ page: String(n) })}
    //         /> */}
    //         <DataTable<Category> 
    //           columns={columns}
    //           data={categories}
    //           isLoading={false}
    //           page={page}
    //           totalPages={totalPages}
    //           onPageChange={(n)=>setSearchParams({page:String(n)})}
    //           keyExtractor={(cat)=>cat.id}
    //           emptyMessage="No categories found. Create One"
    //           />
    //         <ConfirmModal
    //             isOpen={isDeleteModalOpen}
    //             onClose={() => setIsDeleteModalOpen(false)}
    //             onConfirm={confirmDelete}
    //             title="Delete Category"
    //             message="Are you sure to delete this category? "
    //             confirmText="Yes, Delete"
    //             isDanger={true}
    //         />
    //     </div>
    // );

        return (
        <div>
            {/* Header Section Matches UserManagement */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Manage Categories</h1>
                    <p className="text-gray-500 text-sm">Create and organize auction categories</p>
                </div>
                <button
                    onClick={() => {
                        setIsCreating(!isCreating);
                        setEditingId(null);
                        setForm({ name: '', description: "" });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition"
                >
                    {isCreating ? "Cancel" : "+ Add Category"}
                </button>
            </div>

            {msg && <div className="mb-4 p-3 bg-gray-800 border border-gray-700 text-white rounded-lg text-center font-medium">{msg}</div>}

            {/* Create Category Form Matches UserManagement Dark Theme */}
            {isCreating && (
                <form onSubmit={handleSubmit} className="bg-[#161b22] p-6 rounded-xl border border-gray-800 mb-6 w-full max-w-2xl">
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-300 mb-2">Category Name</label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full bg-[#0f111a] border border-gray-700 text-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
                            placeholder="e.g. Vintage"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full bg-[#0f111a] border border-gray-700 text-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm min-h-[100px]"
                            placeholder="Optional description..."
                        />
                    </div>
                    <div className="flex justify-end">
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/20 transition">
                            {editingId ? "Update Category" : "Create Category"}
                        </button>
                    </div>
                </form>
            )}

            {/* Search Bar Matches UserManagement */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-[#161b22] p-4 rounded-xl border border-gray-800">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-full bg-[#0f111a] border border-gray-700 text-gray-300 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); }}
                    />
                </div>
            </div>

            <DataTable<Category> 
              columns={columns}
              data={categories}
              isLoading={false}
              page={page}
              totalPages={totalPages}
              onPageChange={(n)=>setSearchParams({page:String(n)})}
              keyExtractor={(cat)=>cat.id}
              emptyMessage="No categories found. Create One"
            />
            
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Category"
                message="Are you sure to delete this category? "
                confirmText="Yes, Delete"
                isDanger={true}
            />
        </div>
    );

}