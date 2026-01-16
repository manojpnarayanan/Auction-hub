import { useState ,useEffect } from "react";
// import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { getAllAuctions, getMyAuctions } from "../api/auctions";
import CreateAuctionModal from "../components/CreateAuctionModal";



export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Home");
  const [myAuctions,setMyAuctions]=useState<any[]>([]);
  const [allAuctions,setAllAuctions]=useState<any[]>([]);
  const [isModalOpen,setIsModalOpen] =useState(false);

  const fetchAll=async()=>{
    try{
      const res=await getAllAuctions();
      setAllAuctions(res.data.data);
      const myRes=await getMyAuctions();
      setMyAuctions(myRes.data.data);
    }catch(error){
      console.error("Failed to load auctions",error);
    }
  }
  useEffect(()=>{
    fetchAll();
  },[]);

  // useEffect(()=>{
  //    const fetchMine=async ()=>{
  //     try{
  //       const res=await getMyAuctions();
  //       setMyAuctions(res.data.data);
  //     }catch(error){
  //       console.error("Failed to load my auctions",error);
  //     }
  //    };
  //    fetchMine(); 
  // },[]);

  const categories = [
    { name: "Vehicles", icon: "" },
    { name: "Electronics", icon: "" },
    { name: "Others", icon: "" },
  ];

  // const liveAuctions = [
  //   {
  //     title: "Classic car Auction", desc: "1960's restored Vintage",
  //     img: "https://images.unsplash.com/photo-1552519507-da8b1227cb13?q=80&w=2600",
  //   },
  //   {
  //     title: "Luxury Watch", desc: "Exclusive Auv=ction for high-end timepieces",
  //     img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=2599"
  //   },
  //   {
  //     title: "Antique Furniture", desc: "Find unique pieces for your home",
  //     img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=2599"
  //   }

  // ]
  const featuredItems = [
    {
      title: "Vintage Camera", desc: "Classic Film Camera",
      img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2528"
    }, { title: "Gaming Laptop", desc: "High performance laptop for gaming", img: "https://images.unsplash.com/photo-1603302576837-59f9ddd15367?q=80&w=2528" },
    { title: "Designer Handbag", desc: "Limited edition designer handbag", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=2535" },
    { title: "Art Deco Lamp", desc: "Elegant lamp from the Art Deco era", img: "https://images.unsplash.com/photo-1507473888900-52a11b2d8ce2?q=80&w=2500" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* 1. Header (Navbar) */}
      <header className="bg-[#1da1f2] text-white py-3 px-6 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold italic" style={{ fontFamily: "cursive" }}>Auction Hub</h1>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              {["Home", "Categories", "My Bids", "Watchlist"].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`hover:text-white/80 transition ${activeTab === item ? "text-white underline decoration-2 underline-offset-4" : "text-white/90"}`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Icon */}
            <button className="text-white hover:bg-white/10 p-2 rounded-full transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            {/* Profile Avatar */}
            <div className="w-8 h-8 rounded-full bg-white/20 overflow-hidden border border-white/50 cursor-pointer">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2500" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>
      {/* 2. Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[21/9]">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2670"
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
              <div key={cat.name} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-3xl group-hover:shadow-md group-hover:-translate-y-1 transition-all">
                  {cat.icon}
                </div>
                <span className="text-xs font-semibold text-gray-600">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>
        {/* 4. Live Auctions */}
        {/* 4. Live Auctions */}
<section>
  <h3 className="text-xl font-bold text-gray-800 mb-4">Live Auctions</h3>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* CHECK IF EMPTY */}
    {allAuctions.length === 0 ? (
      // 1. SHOW THIS IF EMPTY
      <div className="col-span-3 text-center py-10 bg-white rounded-xl border border-gray-100">
        <p className="text-gray-500 font-medium">No auctions available at the moment.</p>
        <p className="text-sm text-gray-400 mt-1">Check back later or list your own!</p>
      </div>
    ) : (
      // 2. SHOW THIS IF ITEMS EXIST
      allAuctions.map((auction) => (
  <div key={auction._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer">
    {/* Image */}
    <div className="h-40 overflow-hidden bg-gray-200">
      {auction.images && auction.images[0] ? (
        <img src={auction.images[0]} alt={auction.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
      )}
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
        {/* <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Live Auctions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allAuctions.map((auction) => (
              <div key={auction.title} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer">
                <div className="h-40 overflow-hidden">
                  <img src={auction.img} alt={auction.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900">{auction.title}</h4>
                  <p className="text-xs text-blue-500 mt-1">{auction.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section> */}
        {/* 5. Featured Items */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Featured Items</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <div key={item.title} className="group">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-200 mb-3 relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition"></div>
                </div>
                <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                <p className="text-xs text-blue-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-12">
    <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">My Listings</h3>
        <button onClick={()=>setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            + Add New Listing
        </button>
    </div>
    {myAuctions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">You haven't listed anything yet.</p>
        </div>
    ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {myAuctions.map((auction) => (
                <div key={auction._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-40 bg-gray-200">
                        {/* Show image if exists, else placeholder */}
                        {auction.images?.[0] ? (
                            <img src={auction.images[0]} className="w-full h-full object-cover" />
                        ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                    </div>
                    <div className="p-4">
                        <h4 className="font-bold text-gray-900">{auction.title}</h4>
                        <p className="text-blue-600 font-bold mt-1">${auction.startingPrice}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${auction.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {auction.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )}
</section>
      </main>
      {/* 6. Footer */}
      <footer className="bg-gray-100 py-8 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-500">About Us</a>
              <a href="#" className="hover:text-blue-500">Terms of Service</a>
              <a href="#" className="hover:text-blue-500">Privacy Policy</a>
            </div>
            <div>
              © 2024 AuctionHub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      {isModalOpen &&(
        <CreateAuctionModal onClose={()=>setIsModalOpen(false)} onSuccess={fetchAll} />
      )}
    </div>
  );
}