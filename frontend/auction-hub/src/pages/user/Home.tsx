import { useEffect, useState, useCallback } from "react";
import { getAllAuctions } from "../../api/auctions";
import { useNavigate } from "react-router-dom";
import type { AuctionItem } from "../../types/auction";
import type { CategoryItem } from "../../types/category";
import Navbar from "../../components/Navbar"; // 1. Added Navbar
import Footer from "../../components/Footer"; // 2. Added Footer
import { getCategories } from "../../api/Admin/Category";
import toast from "react-hot-toast";


const Home = () => {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [auctions, setAuctions] = useState<AuctionItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

    // Replicate Categories with Icons logic from Dashboard
    const getCategoryIcon = (name: string) => {
        switch (name.toLowerCase()) {
            case "vehicles": return '🚗';
            case 'electronics': return '💻';
            case 'real estate': return '🏠';
            case 'art': return '🎨';
            case 'others': return '📦';
            default: return '✨';
        }
    }

    const fetchAll = useCallback(async () => {
        try {
            const res = await getAllAuctions({ category: selectedCategory, search: searchText });
            setAuctions(res.data.data || res.data);
        } catch (error) {
            console.error("Failed to load auctions", error);
        }
    }, [selectedCategory, searchText]);

    useEffect(() => {
        const loadCats = async () => {
            try {
                const data = await getCategories(1, 100, searchText);
                setCategories([{ _id: 'all', name: "All" }, ...data.categories]);
            } catch (error) {
                toast.error(("Failed to load categories"));
                console.error("Failed to load categories",error);
            }
        }
        loadCats();
    }, [searchText]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const liveAuctions = auctions.filter(a => a.type === 'live' || a.type === 'approved');
    const timedAuctions = auctions.filter(a => a.type === 'timed');

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* 1. Navbar */}
            <Navbar searchText={searchText} setSearchText={setSearchText} />

            {/* 2. Hero Section (Mirrors Dashboard) */}
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video md:aspect-[21/9]">
                    <img
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2600"
                        alt="Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 md:p-12 pointer-events-none">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">Find Your Next Treasure</h2>
                        <p className="text-white/90 text-xs md:text-base max-w-xl line-clamp-2 md:line-clamp-none">
                            Explore a wide range of items, from vintage collectibles to cutting-edge tech. Start bidding now and discover deals.
                        </p>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-6 pb-12 space-y-12">
                {/* 3. Categories (Mirrors Dashboard) */}
                <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Categories</h3>
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {categories.map((cat) => (
                            <div
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0 ${selectedCategory === cat.name ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                            >
                                <div className={`w-16 h-16 rounded-2xl shadow-sm border flex items-center justify-center text-3xl transition-all ${selectedCategory === cat.name ? "bg-blue-50 border-blue-500 scale-110" : "bg-white border-gray-100"}`}>
                                    {getCategoryIcon(cat.name)}
                                </div>
                                <span className={`text-xs font-semibold ${selectedCategory === cat.name ? "text-blue-600" : "text-gray-600"}`}>
                                    {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Live Auctions (Mirrors Dashboard Card style) */}
                <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Live Auctions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {liveAuctions.length === 0 ? (
                            <div className="col-span-3 text-center py-10 bg-white rounded-xl border border-gray-100 italic text-gray-400">
                                No live auctions available.
                            </div>
                        ) : (
                            liveAuctions.map((auction) => (
                                <div key={auction.id}
                                    onClick={() => navigate(auction.type === 'live' ? `/live-auction/${auction.id}` : `/auction/${auction.id}`)}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer">
                                    <div className="h-40 overflow-hidden bg-gray-200">
                                        {auction.images?.[0] ?
                                            <img src={auction.images[0]} alt={auction.title} className="w-full h-full object-cover" /> :
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                        }
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-gray-900 truncate">{auction.title}</h4>
                                        <p className="text-sm text-blue-600 font-bold mt-1">
                                            Current Price: ₹{(auction.currentPrice || auction.startingPrice).toLocaleString('en-IN')}
                                        </p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{auction.category}</span>
                                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 capitalize">{auction.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* 5. Timed Auctions (Mirrors Dashboard Card style) */}
                <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Timed Auctions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {timedAuctions.length === 0 ? (
                            <div className="col-span-3 text-center py-10 bg-white rounded-xl border border-gray-100 italic text-gray-400">
                                No timed auctions available.
                            </div>
                        ) : (
                            timedAuctions.map((auction) => (
                                <div key={auction.id}
                                    onClick={() => navigate(auction.type === 'live' ? `/live-auction/${auction.id}` : `/auction/${auction.id}`)}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer">
                                    <div className="h-40 overflow-hidden bg-gray-200">
                                        {auction.images?.[0] ?
                                            <img src={auction.images[0]} alt={auction.title} className="w-full h-full object-cover" /> :
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                        }
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-gray-900 truncate">{auction.title}</h4>
                                        <p className="text-sm text-blue-600 font-bold mt-1">
                                            Current Bid: ₹{(auction.currentPrice || auction.startingPrice).toLocaleString('en-IN')}
                                        </p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{auction.category}</span>
                                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-bold">{auction.status.toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Home;
