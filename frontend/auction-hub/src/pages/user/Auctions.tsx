import {useEffect,useState} from "react";
import { useSearchParams,useNavigate } from "react-router-dom";
import { getAllAuctions,getAllCategories } from "../../api/auctions";

const Auctions=()=>{
    const [searchParams,setSearchParams]=useSearchParams();
    const navigate=useNavigate();

    const[auctions,setAuctions]=useState<any[]>([]);
    const [categories,setCategories] =useState<any[]>([]);
    const [loading,setLoading]=useState(true);

    const currentType=searchParams.get('type') || 'all';
    const currentCategory=searchParams.get('category')|| "All";
    const currentSearch=searchParams.get('search') || "";

    useEffect(()=>{
        getAllCategories()
        .then(res=>setCategories(res.data.data || res.data))
        .catch(console.error);
    },[]);
    useEffect(()=>{
        setLoading(true);
        getAllAuctions({
            type:currentType==='all'? undefined :currentType,
            category:currentCategory,
            search:currentSearch
        }).then(res=>{
            setAuctions(res.data.data || res.data);
        }).catch(console.error)
        .finally(()=>setLoading(false));
    },[currentType,currentCategory,currentSearch]);

    const updateFilter=(key:string,value:string)=>{
        const newParams=new URLSearchParams(searchParams);
        if(value && value!=="All" && value!=='all'){
            newParams.set(key,value);
        }else{
            newParams.delete(key);
        }
        setSearchParams(newParams);
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header / Navbar would be already included in App layout or you can import a component */}
            
            <div className="flex flex-1 container mx-auto px-4 py-8 gap-8">
                {/* SIDEBAR: Filters */}
                <aside className="w-64 flex-shrink-0 hidden md:block">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="font-bold text-gray-800 mb-4">Categories</h3>
                        <div className="space-y-2">
                             <div 
                                onClick={() => updateFilter('category', 'All')}
                                className={`cursor-pointer px-3 py-2 rounded-lg text-sm ${currentCategory === 'All' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                All Categories
                            </div>
                            {categories.map((cat: any) => (
                                <div 
                                    key={cat._id}
                                    onClick={() => updateFilter('category', cat.name)}
                                    className={`cursor-pointer px-3 py-2 rounded-lg text-sm ${currentCategory === cat.name ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {cat.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
                {/* MAIN CONTENT */}
                <main className="flex-1">
                    {/* Top Tabs */}
                    <div className="flex gap-4 mb-6 border-b border-gray-200 pb-1">
                        {['all', 'live', 'timed'].map(type => (
                            <button
                                key={type}
                                onClick={() => updateFilter('type', type)}
                                className={`pb-3 px-1 text-sm font-medium capitalize border-b-2 transition ${currentType === type ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                {type === 'all' ? 'All Auctions' : `${type} Auctions`}
                            </button>
                        ))}
                    </div>
                    {/* Auction Grid */}
                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading auctions...</div>
                    ) : auctions.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                            <p className="text-gray-500">No auctions found matching your filters.</p>
                            <button onClick={() => setSearchParams(new URLSearchParams())} className="text-blue-600 text-sm mt-2 hover:underline">Clear all filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {auctions.map((auction: any) => (
                                <div key={auction.id} 
                                     onClick={() => navigate(auction.type==='live'? `/live-auction/${auction.id}`:`/auction/${auction.id}`)}
                                     className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer">
                                    <div className="h-48 overflow-hidden bg-gray-200 relative">
                                        <img src={auction.images?.[0] || 'https://via.placeholder.com/300'} alt={auction.title} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 right-2">
                                            <span className={`px-2 py-1 text-xs font-bold rounded shadow-sm ${auction.type === 'live' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                                {auction.type.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-gray-900 truncate mb-1">{auction.title}</h4>
                                        <div className="flex justify-between items-baseline">
                                            <p className="text-sm text-gray-500">Current Bid</p>
                                            <p className="text-lg font-bold text-blue-600">₹{auction.currentPrice}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Auctions