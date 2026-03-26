import { useState } from "react";
import { addReview } from "../api/User/Review";
import type { AxiosError } from "axios";

interface ReviewModalProps{
    isOpen:boolean;
    onClose:()=>void;
    auctionId:string;
    onSuccess:()=>void;
   }

    const ReviewModal:React.FC<ReviewModalProps>=({isOpen,onClose,auctionId,onSuccess})=>{

        const [rating,setRating]=useState(5);
        const [comment,setComment]=useState('');
        const [loading,setLoading]=useState(false);
        const [error,setError]=useState('');
        if(!isOpen) return null;
        const handleSubmit=async()=>{
            if(!comment.trim()){
                setError("please write  a comment");
                return;
            }
            try{
                setLoading(true);
                setError('');
                await addReview(auctionId,rating,comment);
                onSuccess();
                onClose()
            }catch(error:unknown){
                const err=error as AxiosError<{message:string}>;
                setError(err.response?.data?.message || "Failed to submit review");
            }finally{
                setLoading(false);
            }
        }
         return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1c2128] rounded-2xl w-full max-w-md p-6 border border-gray-700 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
                <h2 className="text-2xl font-bold text-white mb-4">Rate your Experience</h2>
                
                {error && <div className="p-3 mb-4 bg-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}
                
                {/* Star Rating Selection */}
                <div className="flex gap-2 justify-center mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                            key={star}
                            onClick={() => setRating(star)}
                            className={`text-4xl transition-all ${star <= rating ? 'text-yellow-400 scale-110' : 'text-gray-600 hover:text-yellow-400/50'}`}
                        >
                            ★
                        </button>
                    ))}
                </div>
                <textarea
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 mb-6 focus:border-blue-500 outline-none resize-none h-24"
                    placeholder="Tell us about the seller and the product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-lg font-bold bg-gray-700 text-gray-300 hover:bg-gray-600 transition">Cancel</button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={loading}
                        className="flex-1 py-3 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </div>
        </div>
    )
    }

    export default ReviewModal;