import { useState } from "react";
import {createAuction} from "../api/auctions";

interface Props{
    onClose:()=>void;
    onSuccess:()=>void;
}

export default function CreateAuctionModal({onClose,onSuccess}:Props){
    const [form,setForm]=useState({
        title:"",
        description:"",
        category:"Others", // Default
        startingPrice:"",
        endDate:"",
        image:""
    });
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");
    const handleChange=(e:React.ChangeEvent<HTMLInputElement |HTMLTextAreaElement | HTMLSelectElement>)=>{
        setForm({...form,[e.target.name]:e.target.value});
    }
    const handleSubmit= async (e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        setError("");
    
    if(!form.title || !form.startingPrice || !form.endDate){
        setError("Please fill in all required fields");
        setLoading(false);
        return;
    }
    try{
        const auctionData={
            ...form,
            startingPrice:Number(form.startingPrice),
            currentPrice:Number(form.startingPrice),
            images:form.image? [form.image]:[]
        }
        await createAuction(auctionData);
        onSuccess();
        onClose();
    }catch(error:any){
        console.error(error);
        setError(error.response?.data?.message)
    }finally{
        setLoading(false);
    }
}
     return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Create New Listing</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">✕</button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" placeholder="e.g. 1969 Ford Mustang" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white outline-none">
                <option value="Vehicles">Vehicles</option>
                <option value="Electronics">Electronics</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Art">Art</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Starting Price ($)</label>
              <input type="number" name="startingPrice" value={form.startingPrice} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">End Date & Time</label>
            <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Image URL</label>
            <input name="image" value={form.image} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="https://example.com/image.jpg" />
            <p className="text-[10px] text-gray-400 mt-1">Paste a direct link to an image.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="Describe your item..." />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#1da1f2] hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md transition-all">
            {loading ? "Creating..." : "Publish Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}