import { useEffect } from "react";
import { getAllAuctions ,getAllCategories } from "../../api/auctions";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home=()=>{
    const [categories,setCategories]=useState<any>([]);
    const [auctions,setAuctions]=useState<any>([]);
    const navigate=useNavigate();
    useEffect(()=>{
        getAllCategories().then(res=>setCategories(res.data)).catch(console.error);

        getAllAuctions({}).then(res=>setAuctions(res.data.data || res.data)).catch(console.error);
    },[]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-blue-600 text-white py-20">
                <div className="container mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-4">Find Your Treasure</h1>
                    <p className="text-xl mb-8">Join active auctions and bid on exclusive items.</p>

                    <button 
            onClick={() => navigate('/auctions')}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg">
            Browse All Auctions
        </button>
                </div>
            </section>
            {/* Categories Section */}
            <section className="container mx-auto py-12 px-4">
                <h2 className="text-3xl font-bold mb-8">Explore Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categories.map((cat: any) => (
                        <div key={cat._id} 
                             onClick={() => navigate('/auctions?category=' + cat.name)}
                             className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition">
                            <h3 className="text-lg font-semibold text-center">{cat.name}</h3>
                        </div>
                    ))}
                </div>
            </section>
            {/* Featured Auctions Section */}
            <section className="container mx-auto py-12 px-4">
                <h2 className="text-3xl font-bold mb-8">Live & Trending Auctions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.slice(0, 6).map((auction: any) => (
                        <div key={auction.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                             {/* You can use your existing AuctionCard component if you have one, or build a simple one here */}
                            <img src={auction.images[0] || 'https://via.placeholder.com/300'} alt={auction.title} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded mb-2 ${auction.type === 'live' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {auction.type === 'live' ? 'LIVE' : 'TIMED'}
                                </span>
                                <h3 className="text-xl font-bold">{auction.title}</h3>
                                <p className="text-gray-600">Current Bid: ₹{auction.currentPrice}</p>
                                <button 
                                    onClick={() => navigate(auction.type === 'live' ? `/live-auction/${auction.id}` : `/auction/${auction.id}`)}
                                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Home;
