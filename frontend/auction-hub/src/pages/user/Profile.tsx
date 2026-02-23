import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import API from "../../api/axiosInstances";
import { getProfile, updateProfile, changePassword } from "../../api/User/profile";
import toast from "react-hot-toast";

type Section = "profile" | "password" | "address" | "wallet";

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    profileImage: string;
}

interface PasswordData {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const navItems: { key: Section; label: string; icon: string }[] = [
    { key: "profile", label: "My Profile", icon: "👤" },
    { key: "password", label: "Change Password", icon: "🔒" },
    { key: "address", label: "Addresses", icon: "📍" },
    { key: "wallet", label: "Wallet", icon: "💰" },
];

export default function Profile() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [activeSection, setActiveSection] = useState<Section>("profile");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profileData, setProfileData] = useState<ProfileData>({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        profileImage: "",
    });

    const [passwordData, setPasswordData] = useState<PasswordData>({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfile();
                setProfileData({
                    name: res.data.name || "",
                    email: res.data.email || "",
                    phone: res.data.phone || "",
                    profileImage: res.data.profileImage || "",
                });
            } catch {
                toast.error("Failed to load profile");
            }
        };
        fetchProfile();
    }, []);

    const handleProfileSave = async () => {
        setLoading(true);
        try {
            await updateProfile({
                name: profileData.name,
                phone: profileData.phone,
                profileImage: profileData.profileImage,
            });
            toast.success("Profile updated successfully!");
        } catch {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if(!passwordData.oldPassword){
            toast.error("Please enter Old password");
            return;
        }
        if(!passwordData.newPassword){
            toast.error("Plaease enter new password");
            return;
        }
        if(!passwordData.confirmPassword){
            toast.error("Plaease enter confirm password");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Old and New Passwords is not matching");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            await changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success("Password changed successfully!");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const handleImageUpload=async(e:React.ChangeEvent<HTMLInputElement>)=>{
        const file=e.target.files?.[0];
        if(!file) return;
        const formData=new FormData();
        formData.append('images',file);
        const API_URL=import.meta.env.VITE_API_URL;
        try{
             const res=await API.post(`${API_URL}/upload`,formData,{
            headers:{'Content-Type':'multipart/form-data'}
        });
        const imageUrl=res.data.images[0].url;
        await updateProfile({
            name:profileData.name,
            phone:profileData.phone,
            profileImage:imageUrl,
        });
        setProfileData(prev=>({...prev,profileImage:imageUrl}));
        toast.success("Profile updated successfully");
        }catch(error){
            toast.error("Failed to upload photo");
        }
       
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your profile, password, addresses and wallet</p>
                </div>

                <div className="flex gap-6">
                    {/* ── Side Navbar ── */}
                    <aside className="w-64 shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Avatar area */}
                            <div className="bg-[#1da1f2] px-6 py-8 flex flex-col items-center gap-3">
                                <div
                                    className="relative cursor-pointer group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {profileData.profileImage ? (
                                        <img
                                            src={profileData.profileImage}
                                            alt="Profile"
                                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white shadow-md flex items-center justify-center text-white text-2xl font-bold">
                                            {getInitials(profileData.name || "U")}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                        <span className="text-white text-xs font-semibold">Change</span>
                                    </div>
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                <div className="text-center">
                                    <p className="text-white font-bold text-sm">{profileData.name}</p>
                                    <p className="text-white/70 text-xs">{profileData.email}</p>
                                </div>
                            </div>

                            {/* Nav items */}
                            <nav className="p-3 space-y-1">
                                {navItems.map((item) => (
                                    <button
                                        key={item.key}
                                        onClick={() => setActiveSection(item.key)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === item.key
                                            ? "bg-[#1da1f2]/10 text-[#1da1f2] border border-[#1da1f2]/20"
                                            : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className="text-base">{item.icon}</span>
                                        {item.label}
                                        {activeSection === item.key && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1da1f2]" />
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* ── Main Content ── */}
                    <main className="flex-1">

                        {/* ── Profile Section ── */}
                        {activeSection === "profile" && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <h2 className="text-lg font-bold text-gray-800 mb-1">Personal Information</h2>
                                <p className="text-sm text-gray-400 mb-6">Update your name and contact details</p>

                                <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
                                    {profileData.profileImage ? (
                                        <img src={profileData.profileImage} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-[#1da1f2]" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-[#1da1f2] flex items-center justify-center text-white text-xl font-bold">
                                            {getInitials(profileData.name || "U")}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-gray-800">{profileData.name}</p>
                                        <p className="text-sm text-gray-400">{profileData.email}</p>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-xs text-[#1da1f2] font-medium mt-1 hover:underline"
                                        >
                                            Change profile photo
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1da1f2] focus:ring-2 focus:ring-[#1da1f2]/20 transition"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Email Address</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            disabled
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1da1f2] focus:ring-2 focus:ring-[#1da1f2]/20 transition"
                                            placeholder="+91 9999999999"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={handleProfileSave}
                                        disabled={loading}
                                        className="bg-[#1da1f2] hover:bg-[#1a91da] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition disabled:opacity-60"
                                    >
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Change Password Section ── */}
                        {activeSection === "password" && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <h2 className="text-lg font-bold text-gray-800 mb-1">Change Password</h2>
                                <p className="text-sm text-gray-400 mb-6">Use a strong password with letters, numbers and symbols</p>

                                <div className="max-w-md space-y-5">
                                    {[
                                        { label: "Current Password", key: "oldPassword" as const, placeholder: "Enter current password" },
                                        { label: "New Password", key: "newPassword" as const, placeholder: "Enter new password" },
                                        { label: "Confirm New Password", key: "confirmPassword" as const, placeholder: "Confirm new password" },
                                    ].map((field) => (
                                        <div key={field.key}>
                                            <label className="block text-sm font-medium text-gray-600 mb-1.5">{field.label}</label>
                                            <input
                                                type="password"
                                                value={passwordData[field.key]}
                                                onChange={(e) => setPasswordData({ ...passwordData, [field.key]: e.target.value })}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1da1f2] focus:ring-2 focus:ring-[#1da1f2]/20 transition"
                                                placeholder={field.placeholder}
                                            />
                                        </div>
                                    ))}

                                    <div className="pt-2">
                                        <button
                                            onClick={handlePasswordChange}
                                            disabled={loading}
                                            className="w-full bg-[#1da1f2] hover:bg-[#1a91da] text-white font-semibold py-2.5 rounded-xl text-sm transition disabled:opacity-60"
                                        >
                                            {loading ? "Updating..." : "Update Password"}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                    <p className="text-xs font-semibold text-blue-700 mb-1">Password Tips</p>
                                    <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
                                        <li>At least 6 characters long</li>
                                        <li>Include uppercase & lowercase letters</li>
                                        <li>Add numbers and symbols for strength</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* ── Address Section (Coming Soon) ── */}
                        {activeSection === "address" && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800">Saved Addresses</h2>
                                        <p className="text-sm text-gray-400 mt-1">Manage your delivery addresses</p>
                                    </div>
                                    <button className="bg-[#1da1f2] hover:bg-[#1a91da] text-white font-semibold px-4 py-2 rounded-xl text-sm transition">
                                        + Add Address
                                    </button>
                                </div>

                                {/* Empty State */}
                                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <div className="text-5xl mb-4">📍</div>
                                    <p className="text-gray-600 font-semibold">No addresses saved yet</p>
                                    <p className="text-sm text-gray-400 mt-1">Add an address to use during checkout</p>
                                    <button className="mt-4 bg-[#1da1f2] text-white font-semibold px-5 py-2 rounded-xl text-sm hover:bg-[#1a91da] transition">
                                        Add Your First Address
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Wallet Section (Coming Soon) ── */}
                        {activeSection === "wallet" && (
                            <div className="space-y-4">
                                {/* Balance Card */}
                                <div className="bg-gradient-to-r from-[#1da1f2] to-[#0d8ddc] rounded-2xl p-6 text-white shadow-md">
                                    <p className="text-sm text-white/80 font-medium">Available Balance</p>
                                    <p className="text-4xl font-bold mt-1">₹0.00</p>
                                    <div className="flex gap-3 mt-5">
                                        <button className="bg-white text-[#1da1f2] font-semibold px-5 py-2 rounded-xl text-sm hover:bg-gray-50 transition">
                                            Add Money
                                        </button>
                                        <button className="bg-white/20 text-white font-semibold px-5 py-2 rounded-xl text-sm hover:bg-white/30 transition border border-white/30">
                                            Withdraw
                                        </button>
                                    </div>
                                </div>

                                {/* Transactions */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="font-bold text-gray-800 mb-4">Recent Transactions</h3>

                                    {/* Empty State */}
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                        <div className="text-5xl mb-3">💸</div>
                                        <p className="text-gray-600 font-semibold">No transactions yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Your payment history will appear here</p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
}
