import { useEffect, useState } from "react";
import { createCategory, getCategories ,updateCategory,deleteCategory} from "../../api/Admin/Category";
import Pagination from "../../components/Pagination";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmationModal";



interface Category{
    id:string;
    name:string;
    description:string;
    isActive:boolean;
}

export default function AdminCategories(){
    const [categories,setCategories]=useState<Category[]>([]);
    const [isCreating,setIsCreating]= useState(false);
    const [editingId,setEditingId]=useState<string | null>(null);
    const [form,setForm]=useState({name:"",description:""});
    const [msg,setMsg]=useState("");
    const [isDeleteModalOpen,setIsDeleteModalOpen]=useState(false);
    const [categoryToDelete,setCategoryToDelete]=useState<string | null>(null);
    const [searchTerm,setSearchTerm]=useState('');
    const [debounceTerm,setDebounceTerm]=useState("")
    const [totalPages,setTotalPages]=useState(1);
    const limit=2
    const [searchParams,setSearchParams]=useSearchParams();
    const page=parseInt(searchParams.get('page')||"1");

    useEffect(()=>{
      const timerId=setTimeout(()=>{
        setDebounceTerm(searchTerm);
      },500)
      return()=> clearTimeout(timerId);
    },[searchTerm])

    useEffect(()=>{
        fetchCategories();
    },[page,debounceTerm])

    const fetchCategories=async ()=>{
        try{
            const data=await getCategories(page,limit,debounceTerm);
            console.log(data);
            setCategories(data.categories);
            setTotalPages(Math.ceil(data.total/limit));
        }catch(error){
            console.error("Failed to fetch Categories",error);
        }
    }
    
    const handleDelete=async(id:string)=>{
      setCategoryToDelete(id);
      setIsDeleteModalOpen(true);
    }
    const confirmDelete=async ()=>{
      if(!categoryToDelete) return;
      try{
        await deleteCategory(categoryToDelete);
        toast.success("Category deleted successfully");
        fetchCategories();
        setIsDeleteModalOpen(false);
      }catch(error){
        console.error(error);
        toast.error("Failed to delete category");
      }
    }
    const handleEdit=async (category:Category)=>{
        setEditingId(category.id)
        setForm({name:category.name,description:category.description});
        setIsCreating(true);
        setMsg("");
    }

    const handleSubmit=async (e:React.FormEvent)=>{
        e.preventDefault();
        if(!form.name.trim()){
          throw new Error("Category name cannot be empty or spaces only");
          return;
        }
        try{
            if(editingId){
                await updateCategory(editingId,form);
                toast.success("Category updated successfully")
            }else{
                await createCategory(form);
                toast.success("Category created Successfully");

            }
            setForm({name:"",description:""});
            setIsCreating(false);
            setEditingId(null);
            fetchCategories()
        }catch(error:any){
            console.error(error);
            const errorMessage=error.response?.data?.message|| "Failed to create category"
            toast.error(errorMessage);
        }
    }
     return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Categories</h1>
        <input type="text" value={searchTerm} onChange={(e)=>{setSearchTerm(e.target.value)}} placeholder="Search here......" className="border px-3 py-2 rounded-lg"  />
        <button 
          onClick={() =>{ 
            setIsCreating(!isCreating);
            setEditingId(null);
            setForm({name:'',description:""});
        }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isCreating ? "Cancel" : "+ Add Category"}
        </button>
      </div>
      {msg && <div className="mb-4 p-3 bg-gray-100 rounded text-center font-medium">{msg}</div>}
      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-md">
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">Category Name</label>
            <input 
              type="text" 
              required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Vintage"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <textarea 
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional description..."
            />
          </div>
          <button className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700">
           {editingId ? "Update Category" :"Create Category"}
          </button>
        </form>
      )}
      {/* Placeholder for List */}
      {/* <div className="mt-8 text-gray-400 text-center border-2 border-dashed border-gray-200 rounded-xl p-10">
        List of categories will appear here...
      </div>
       */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-gray-800">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{cat.description || "-"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${cat.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={()=>handleEdit(cat)} className="text-blue-500 hover:text-blue-700 text-sm font-bold mr-3">Edit</button>
                    <button onClick={()=>handleDelete(cat.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  No categories found. Create one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination 
       currentPage={page}
       totalPages={totalPages}
       onPageChange={(n)=>setSearchParams({page:String(n)})}
      />
      <ConfirmModal 
      isOpen={isDeleteModalOpen}
      onClose={()=>setIsDeleteModalOpen(false)}
      onConfirm={confirmDelete}
      title="Delete Category"
      message="Are you sure to delete this category? "
      confirmText="Yes, Delete"
      isDanger={true}
      />
    </div>
  );
}