import { useSelector, useDispatch, } from "react-redux";
import { useState, useEffect } from "react";
import type { RootState } from "../redux/store";
import { setAllAuctions } from "../redux/slices/auctionSlice";
import { getAllAuctions } from "../api/auctions";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api/Admin/Category";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";



export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState<{ id: string, name: string, icon?: string }[]>([]);
  const { allAuctions } = useSelector((state: RootState) => state.auctions)
  const liveAuction = allAuctions.filter((a: any) => a.type === 'live');
  const timedAuctions = allAuctions.filter((a: any) => a.type === 'timed');

  const [selectedCategory, setSelectedCategory] = useState("All");


  useEffect(() => {
    const loadCats = async () => {
      try {
        const data = await getCategories(1,100,searchText);
        setCategories([{ id: "all", name: "All" }, ...data.categories]);
      } catch (error) {
        console.error(error);
      }
    }
    loadCats()
  }, [])
  
  const fetchAll = async (category: string = "All", search: string = "") => {
    try {
      const res = await getAllAuctions({ category, search });
      dispatch(setAllAuctions(res.data.data));
    } catch (error) {
      console.error("Failed to load auctions", error);
    }
  }
  useEffect(() => {
    fetchAll(selectedCategory, searchText);
  }, [selectedCategory, searchText]);

  
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* 1. Header (Navbar) */}
     <Navbar searchText={searchText} setSearchText={setSearchText} />
      {/* 2. Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[21/9]">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2600"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Find Your Next Treasure</h2>
            <p className="text-white/90 text-sm md:text-base max-w-xl">
              Explore a wide range of items, from vintage collectibles to cutting-edge tech. Start bidding now and discover deals.
            </p>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-6 pb-12 space-y-12">

        {/* 3. Categories */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Categories</h3>
          <div className="flex gap-6">
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)} 
                className={`flex flex-col items-center gap-2 cursor-pointer group ${selectedCategory === cat.name ? "opacity-100" : "opacity-60 hover:opacity-100"}`} // Active styling
              >
                <div className={`w-16 h-16 rounded-2xl shadow-sm border flex items-center justify-center text-3xl transition-all ${selectedCategory === cat.name ? "bg-blue-50 border-blue-500 scale-110" : "bg-white border-gray-100"}`}>
                  {/* {cat.icon} */}
                  {getCategoryIcon(cat.name)}
                </div>
                <span className={`text-xs font-semibold ${selectedCategory === cat.name ? "text-blue-600" : "text-gray-600"}`}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </section>
        {/* 4. Live Auctions */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Live Auctions</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CHECK IF EMPTY */}
            {liveAuction.length === 0 ? (
              // 1. SHOW THIS IF EMPTY
              <div className="col-span-3 text-center py-10 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500 font-medium">No auctions available at the moment.</p>
                <p className="text-sm text-gray-400 mt-1">Check back later or list your own!</p>
              </div>
            ) : (
              // 2. SHOW THIS IF ITEMS EXIST
              liveAuction.map((auction: any) => (
                <div key={auction.id}
                  onClick={() => navigate(`/auction/${auction.id}`)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer">
                  {/* Image */}
                  <div className="h-40 overflow-hidden bg-gray-200">
                    {(() => {
                      // Prioritize first image of array, fallback to old single string
                      const imgSrc = auction.images?.[0] || auction.image;

                      return imgSrc ? (
                        <img src={imgSrc} alt={auction.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                      );
                    })()}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 truncate">{auction.title}</h4>
                    <p className="text-sm text-blue-600 font-bold mt-1">
                      Current Bid: ${auction.currentPrice || auction.startingPrice}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {auction.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${auction.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {auction.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
       
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Timed Auctions</h3> {/* Changed Title */}

          {/* Copy the Grid layout from Live Auctions but use timedAuctions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {timedAuctions.length === 0 ? (
              <p className="text-gray-500">No timed auctions available.</p>
            ) : (
              timedAuctions.map((auction: any) => (
                // ... Copy the exact same Card code from Live Auctions ...
                // ... just change key={auction.id} ...
                <div key={auction.id}
                  onClick={() => navigate(`/auction/${auction.id}`)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer">
                  {/* ... Same Image Logic ... */}
                  <div className="h-40 overflow-hidden bg-gray-200">
                    {(() => {
                      const imgSrc = auction.images?.[0] || auction.image;
                      return imgSrc ? (
                        <img src={imgSrc} alt={auction.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                      );
                    })()}
                  </div>
                  {/* ... Same Content Logic ... */}
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 truncate">{auction.title}</h4>
                    <p className="text-sm text-blue-600 font-bold mt-1">
                      Current Bid: ${auction.currentPrice || auction.startingPrice}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {auction.category}
                      </span>
                      {/* Show End Date for Timed */}
                      {/* <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                        Ends: {new Date(auction.endDate).toLocaleDateString()}
                      </span> */}
                      <span className={`text-xs px-2 py-1 rounded-full ${auction.status === 'active' ? 'bg-green-100 text-green-700' :
                        auction.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {auction.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        
        
      </main>
      {/* 6. Footer */}
      <Footer/>
      
    </div>
  );
}