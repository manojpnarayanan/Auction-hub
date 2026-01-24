import { useState,useEffect } from "react";
import { createAuction ,updateAuction} from "../api/auctions";
import { getCategories } from "../api/Admin/Category";
import API from "../api/axiosInstances";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  initialData?:any;
}

export default function CreateAuctionModal({ onClose, onSuccess, initialData }: Props) {

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Others", // Default
    startingPrice: "",
    endDate: "",
    images: [] as string[]
  });
  const [categories,setCategories]=useState<{id:string,name:string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(()=>{
    const fetchCat=async()=>{
      try{
        const data=await getCategories();
        setCategories(data);
      }catch(err){
        console.error("Failed to load categories");
      }
    }
    fetchCat();
  },[])

  useEffect(()=>{
    if(initialData){
      setForm({
        title:initialData.title,
        description:initialData.description,
        category:initialData.category,
        startingPrice:initialData.startingPrice,
        endDate:initialData.endDate,
        images:initialData.images||[],

      })
    }
  },[initialData]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length===0) return;

    setUploading(true);
    const formData = new FormData();
    
    Array.from(files).forEach((file)=>{
      formData.append('images',file);
    });

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await API.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const newUrls=res.data.images.map((img:any)=>img.url);

      setForm((prev) => ({ ...prev, images: [...prev.images,...newUrls] }));
    } catch (err) {
      console.error("Upload Failed", err);
      setError("Image upload failed. Please try again")
    } finally {
      setUploading(false);
    }
  }
  const removeImage=(indexToRemove:number)=>{
    setForm(prev=>({
      ...prev,
      images:prev.images.filter((_, index)=>index !==indexToRemove)
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!form.title || !form.startingPrice || !form.endDate) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }
    if(form.images.length<3){
      setError(`Please upload atlest 3 images (Current:${form.images.length}) `);
      setLoading(false);
      return;
    }

    try {
      const auctionData = {
        ...form,
        startingPrice: Number(form.startingPrice),
        currentPrice: Number(form.startingPrice),
        images: form.images
      }
      // await createAuction(auctionData);
      // onSuccess();
      // onClose();
      if (initialData) {
            await updateAuction(initialData.id, auctionData);
        } else {
            await createAuction(auctionData);
        }
        onSuccess();
        onClose();
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.message)
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">

        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{initialData? "Edit Listing" :"Create new Listing"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="e.g. 1969 Ford Mustang" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Category</label>
              {/* <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white outline-none">
                <option value="Vehicles">Vehicles</option>
                <option value="Electronics">Electronics</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Art">Art</option>
                <option value="Others">Others</option>
              </select> */}
              <select 
    name="category" 
    value={form.category} 
    onChange={handleChange} 
    className="w-full px-3 py-2 border rounded-lg bg-white outline-none"
>
    <option value="Others">Select Category</option>
    {categories.map((cat) => (
        <option key={cat.id} value={cat.name}>
            {cat.name}
        </option>
    ))}
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
          {/* --- NEW FILE UPLOAD SECTION --- */}
          <div>
  <label className="block text-xs font-bold text-gray-600 mb-1">
    Product Images (Min 3)
    {/* Live Validation Message */}
    {form.images.length > 0 && form.images.length < 3 && (
       <span className="text-red-500 ml-2 font-normal animate-pulse">
          (Need {3 - form.images.length} more)
       </span>
    )}
  </label>
  
  <div className="border border-dashed border-gray-200 rounded-lg p-3 bg-gray-50 text-center">
    
    {uploading ? (
      <span className="text-xs text-blue-500 font-bold animate-pulse">Uploading...</span>
    ) : (
      <>
        {/* Image Grid with Delete Buttons */}
        {form.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {form.images.map((img, idx) => (
              <div key={idx} className="relative group aspect-square">
                <img src={img} alt="Preview" className="w-full h-full object-cover rounded-md border border-gray-200" />
                {/* Delete Button (X) */}
                <button 
                  type="button" 
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Field (Always visible so you can add MORE) */}
        <div className="relative">
             <input 
                type="file" 
                multiple 
                onChange={handleFileChange} 
                accept="image/*" 
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors" 
             />
             <p className="text-[10px] text-gray-400 mt-2">
                {form.images.length === 0 ? "Select multiple images..." : "Add more images..."}
             </p>
        </div>
      </>
    )}
  </div>
</div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="Describe your item..." />
          </div>
          <button type="submit" disabled={loading || uploading} className={`w-full font-bold py-3 rounded-xl shadow-md transition-all text-white ${loading || uploading ? "bg-gray-400" : "bg-[#1da1f2] hover:bg-blue-600"}`}>
            {initialData ? "Update Listing" : "Publish Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}