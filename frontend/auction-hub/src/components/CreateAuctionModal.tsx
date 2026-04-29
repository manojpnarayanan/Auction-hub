import { useState, useEffect } from "react";
import { createAuction, updateAuction } from "../api/auctions";
import { getSubscription } from "../api/User/subscription";
import { getCategories } from "../api/Admin/Category";
import API from "../api/axiosInstances";
import type{ checkSubscription } from "../types/subscribe";
import  type { AuctionItem } from "../types/auction";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Partial<AuctionItem>;
}


const toLocalISO = (dateStr: string | Date | undefined) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset() * 60000; 
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
};

export default function CreateAuctionModal({ onClose, onSuccess, initialData }: Props) {

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Others",
    startingPrice: "",
    endDate: "",
    images: [] as string[],
    type: "timed",
    startTime: ''
  });
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [subscriptionLimit,setSubscriptionLimit]=useState<checkSubscription | null>(null)
  const [planName,setPlanName]=useState('free');

  useEffect(() => {
    const fetchCat = async () => {
      try {
        const data = await getCategories(1, 100,'');
        setCategories(data.categories);
      } catch (err:unknown) {
        const error=err as AxiosError<{message:string}>
        console.error("Failed to load categories");
        toast.error(error.response?.data?.message || 'Failed to load Categories');
      }
    }
    fetchCat();
  }, [])

  useEffect(() => {
    
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'others',
        startingPrice: initialData.startingPrice?.toString() || "",
        endDate: initialData.endDate ?  toLocalISO(initialData.endDate)  : "",
        images: initialData.images || [],
        type: initialData.type || 'timed',
        startTime: initialData.startTime ? toLocalISO(initialData.startTime) : ""
      });
    }
  }, [initialData]);
  
  
  useEffect(()=>{
    getSubscription().then(res=>{
      setSubscriptionLimit(res.data.data.limits);
      setPlanName(res.data.data.plan);
    }).catch(()=>{});
  },[]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });

    try {
      
      const res = await API.post(`/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const newUrls = res.data.data.images.map((img: {url:string}) => img.url);

      setForm((prev) => ({ ...prev, images: [...prev.images, ...newUrls] }));
    } catch (err) {
      console.error("Upload Failed", err);
      setError("Image upload failed. Please try again")
    } finally {
      setUploading(false);
    }
  }
  const removeImage = (indexToRemove: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.title || !form.startingPrice || !form.endDate) {
      setError("Please fill the required fields");
      setLoading(false);
      return;
    }
    if (!form.title.trim()) {
      setError("Title is required");
      setLoading(false);
      return;
    }
    if (!form.description.trim()) {
      setError("Description required");
      setLoading(false);
      return;
    }
    if (!form.category || form.category === "Select Category") {
      setError("Please select a category");
      setLoading(false);
      return;
    }
    if (!form.startingPrice || Number(form.startingPrice) <= 0) {
      setError("Price should be a positive Integer");
      setLoading(false);
      return;
    }
    const now = new Date();
    const endDate = new Date(form.endDate);
    if (!form.endDate) {
      setError("End date required");
      setLoading(false);
      return;
    }
    if (endDate <= now) {
      setError("End date should be a future date");
      setLoading(false);
      return;
    }
    if(subscriptionLimit){
      const durationDays=(new Date(form.endDate).getTime()-Date.now())/(1000*60*60*24);
      if(durationDays>subscriptionLimit.maxDays){
        setError(`Your ${planName} plan allows a max auction duration of ${subscriptionLimit.maxDays} days`);
        setLoading(false);
        return;
      }
    }
    if (form.type === 'live') {
      if (!form.startTime) {
        setError("Start time is required ");
        setLoading(false);
        return;
      }
      const startTime = new Date(form.startTime);
      if (startTime <= now) {
        setError("Start time must be a future date");
        setLoading(false);
        return;
      }
      if (endDate <= startTime) {
        setError("End time must be after start Date");
        setLoading(false);
        return;
      }
      
      const durationHours = (endDate.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      if(durationHours>2){
        setError("Live auctions cannot exceedded 2 hours. Please shorten the duration");
        setLoading(false);
        return;
      }
    }
    if (form.images.length < 3) {
      setError(`Please upload atlest 3 images (Current:${form.images.length}) `);
      setLoading(false);
      return;
    }

    try {
      const auctionData = {
        ...form,
        startingPrice: Number(form.startingPrice),
        currentPrice: Number(form.startingPrice),
        images: form.images,
        endDate:new Date(form.endDate),
        startTime:form.startTime? new Date(form.startTime) : undefined
      }as AuctionItem
      if (initialData) {
        await updateAuction(initialData.id!, auctionData);
      } else {
        await createAuction(auctionData);
      }
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error(error);
      const err=error as AxiosError<{message:string}>
      setError(err.response?.data?.message  || "Failed" )
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">

        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{initialData ? "Edit Listing" : "Create new Listing"}</h2>
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
              
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-white outline-none"
              >
                <option value="Select Category">Select Category</option>
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
          {/* --- Type Selection --- */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-600 mb-1">Auction Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="type" value="timed" checked={form.type === 'timed'} onChange={handleChange} />
                <span className="text-sm">Timed Auction</span>
              </label>
              
              <label className={`flex items-center gap-2 ${!subscriptionLimit?.hasLive ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
  <input
    type="radio"
    name="type"
    value="live"
    checked={form.type === 'live'}
    onChange={handleChange}
    disabled={!subscriptionLimit?.hasLive}
  />
  <span className="text-sm">
    Live Auction {!subscriptionLimit?.hasLive && (
      <span className="text-xs text-orange-500">(Basic+ only)</span>
    )}
  </span>
</label>

            </div>
          </div>

          {/* --- Conditional Inputs --- */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Show Start Time ONLY for Live */}
            {form.type === 'live' && (
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Start Time</label>
                <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" />
              </div>
            )}

           
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                {form.type === 'live' ? 'Expected End Time' : 'End Date & Time'}
              </label>
              <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" />
            </div>
          </div>
          
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