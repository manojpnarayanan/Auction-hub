import { useEffect,useState } from "react";
import { CreateSubscriptionPlan,getAllSubscriptionPlan,updateSubscriptionPlan,deleteSubscriptionPlan } from "../../api/Admin/subscription";
import toast from "react-hot-toast";



interface Plan{
    id:string;
    name:string;
    price:number;
    auctionsPerYear:number;
    maxDays:number;
    hasLive:boolean;
    commission:number;
    isActive:boolean;
}

const emptyForm={
    name:"",
    price:0,
    auctionsPerYear:1,
    maxDays:3,
    hasLive:false,
    commission:0.06
}

export default function AdminSubscriptionPlan(){
    const[plans,setPlans]=useState<Plan[]>([]);
    const [isCreating,setIsCreating]=useState(false);
    const [editingId,setEditingId]=useState<string|null>(null);
    const [form,setForm]=useState(emptyForm);

    useEffect(()=>{
        fetchPlans()
    },[]);
    const fetchPlans=async()=>{
        try{
            const res=await getAllSubscriptionPlan();
            setPlans(res.data);
        }catch{
            toast.error("Failed to fetch Plans");
        }
    }
    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        try{
            if(editingId){
                await updateSubscriptionPlan(editingId,form);
                toast.success("Plan Created");
            }else{
                await CreateSubscriptionPlan(form);
                toast.success("Plan created")
            }
            setForm(emptyForm);
            setIsCreating(false);
            setEditingId(null);
            fetchPlans();
        }catch(error:any){
            toast.error(error.response?.data?.message || "Failed to save Plan")
        }
    }
    const handleEdit=async (plan:Plan)=>{
        try{
            setEditingId(plan.id);
            setForm({name:plan.name,
                price:plan.price,
                auctionsPerYear:plan.auctionsPerYear,
                maxDays:plan.maxDays,
                hasLive:plan.hasLive,
                commission:plan.commission,
            })
            setIsCreating(true);
        }catch(error){
            toast.error("Editing failed");
        }
    }

    const handleDelete=async(id:string)=>{
        if(!confirm("Gelete this plan"))return;
        try{
            await deleteSubscriptionPlan(id);
            toast.success("Plan deleted");
            fetchPlans();
        }catch{
            toast.error("Failed to delete plan")
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Subscription Plans</h1>
                <button onClick={() => { setIsCreating(!isCreating); setEditingId(null); setForm(emptyForm); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    {isCreating ? "Cancel" : "+ Add Plan"}
                </button>
            </div>
            {isCreating && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Plan Name</label>
                        <input type="text" required value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2" placeholder="e.g. Basic" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹/year)</label>
                        <input type="number" required value={form.price}
                            onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                            className="w-full border rounded-lg px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Auctions Per Year</label>
                        <input type="number" required value={form.auctionsPerYear}
                            onChange={e => setForm({ ...form, auctionsPerYear: Number(e.target.value) })}
                            className="w-full border rounded-lg px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Max Duration (days)</label>
                        <input type="number" required value={form.maxDays}
                            onChange={e => setForm({ ...form, maxDays: Number(e.target.value) })}
                            className="w-full border rounded-lg px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Commission Rate (e.g. 0.06 = 6%)</label>
                        <input type="number" step="0.01" required value={form.commission}
                            onChange={e => setForm({ ...form, commission: Number(e.target.value) })}
                            className="w-full border rounded-lg px-3 py-2" />
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                        <input type="checkbox" id="hasLive" checked={form.hasLive}
                            onChange={e => setForm({ ...form, hasLive: e.target.checked })}
                            className="w-5 h-5" />
                        <label htmlFor="hasLive" className="text-sm font-bold text-gray-700">Allow Live Auctions</label>
                    </div>
                    <div className="col-span-2">
                        <button className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700">
                            {editingId ? "Update Plan" : "Create Plan"}
                        </button>
                    </div>
                </form>
            )}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Auctions/yr</th>
                            <th className="px-6 py-4">Max Days</th>
                            <th className="px-6 py-4">Live</th>
                            <th className="px-6 py-4">Commission</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {plans.length > 0 ? plans.map(plan => (
                            <tr key={plan.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-bold text-gray-800">{plan.name}</td>
                                <td className="px-6 py-4">₹{plan.price}/yr</td>
                                <td className="px-6 py-4">{plan.auctionsPerYear === 999999 ? 'Unlimited' : plan.auctionsPerYear}</td>
                                <td className="px-6 py-4">{plan.maxDays} days</td>
                                <td className="px-6 py-4">{plan.hasLive ? '✅' : '❌'}</td>
                                <td className="px-6 py-4">{(plan.commission * 100).toFixed(0)}%</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleEdit(plan)} className="text-blue-500 hover:text-blue-700 text-sm font-bold mr-3">Edit</button>
                                    <button onClick={() => handleDelete(plan.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={7} className="text-center py-8 text-gray-400">No plans yet. Create one!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}