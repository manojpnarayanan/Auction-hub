import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import API from "../../api/axiosInstances";
import { getProfile, updateProfile, changePassword } from "../../api/User/profile";
import { getAddress, updateAddress, addAddress, deleteAddress, setDefaultAddress } from "../../api/User/Address";
import type { AddressResponseDTO, CreateAddressDTO, AddressLabel } from "../../types/User-Address";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmationModal";
import { getWallet } from "../../api/User/wallet";
import type { WalletWithTransactions } from "../../types/wallet";
import { AxiosError } from "axios";
import type { TransactionItem } from "../../types/transaction";
import Pagination from "../../components/Pagination";
import { MESSAGES } from "../../Constants/messages";


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
    const [addresses, setAddresses] = useState<AddressResponseDTO[]>([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressResponseDTO | null>(null);
    const [confirmDeletedId, setConfirmDeltedId] = useState<string | null>(null)
    const [addressForm, setAddressForm] = useState<CreateAddressDTO>({
        label: "Home",
        street: "",
        city: "",
        state: "",
        pincode: ""
    });
    const [walletData, setWalletData] = useState<WalletWithTransactions | null>(null);
    const [walletLoading, setWalletLoading] = useState(false);
    const [walletPage, setWalletPage] = useState(1);
    const walletLimit = 5;


    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await getAddress();
                setAddresses(res.data.data);
            } catch (error) {
                const err = error as AxiosError<{ message: string }>
                toast.error(err.response?.data?.message || "Failed to load Addresses");
            }
        }
        fetchAddresses();
    }, []);
    const resetAddressForm = () => {
        setAddressForm({ label: 'Home', street: "", city: "", state: "", pincode: "" });
        setEditingAddress(null);
        setShowAddressForm(false);
    };
    const handleAddressSubmit = async () => {
        if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pincode) {
            toast.error("Please fill all fields");
            return;
        }
        const error = validAddressFrom();
        if (error) {
            toast.error(error)
            return;
        }
        setLoading(true);
        try {
            if (editingAddress) {
                const res = await updateAddress(editingAddress.id, addressForm);
                setAddresses(prev => prev.map(a => a.id === editingAddress.id ? res.data : a));
                toast.success("Address updated successfully");
            } else {
                const res = await addAddress(addressForm);
                setAddresses(prev => [...prev, res.data]);
                toast.success("Address added ")
            }
        } catch {
            toast.error("failed to save address");
        } finally {
            setLoading(false);
        }
    }
    const validAddressFrom = (): string | null => {
        if (!addressForm.street.trim()) return "Street is required";
        if (addressForm.street.trim().length > 25) return "Street address is too long";
        if (!addressForm.city.trim()) return "City is required";
        if (!/^[a-zA-Z\s]+$/.test(addressForm.city.trim())) return "City must contain only characters";
        if (!addressForm.state.trim()) return "State is required";
        if (!/^[a-zA-Z\s]+$/.test(addressForm.state.trim())) return "State must contain only characters";
        if (!addressForm.pincode.trim()) return "Pincode required";
        if (!/^[1-9][0-9]{5}$/.test(addressForm.pincode.trim())) return "Enter a valid 6 digit Indian Pincode";
        return null;
    }
    const handleDeleteAddress = async () => {
        if (!confirmDeletedId) return;

        try {
            await deleteAddress(confirmDeletedId);
            setAddresses(prev => prev.filter(a => a.id !== confirmDeletedId));
            toast.success("Address delted successfully")
        } catch {
            toast.error("Failed to delete address");
        }
    }
    const handleSetDefault = async (id: string) => {
        try {
            await setDefaultAddress(id);
            setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
            toast.success("Default address updated")
        } catch {
            toast.error("Failed to update default");
        }
    }
    const handleEditAddress = async (address: AddressResponseDTO) => {
        setEditingAddress(address);
        setAddressForm({
            label: address.label as AddressLabel,
            street: address.street,
            city: address.city,
            state: address.state,
            pincode: address.pincode
        });
        setShowAddressForm(true);
    }

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
                    name: res.data.data.name || '',
                    email: res.data.data.email || "",
                    phone: res.data.data.phone || "",
                    profileImage: res.data.data.profileImage || "",
                });
            } catch (error) {
                const err = error as AxiosError<{ message: string }>
                toast.error(err.response?.data?.message || "Failed to load profile");
            }
        };
        fetchProfile();
    }, []);
    useEffect(() => {
        if (activeSection !== 'wallet') return;
        const fetchWallet = async () => {
            setWalletLoading(true);
            try {
                const res = await getWallet(walletPage, walletLimit);
                setWalletData(res.data.data);
            } catch (error) {
                const err = error as AxiosError<{ message: string }>
                toast.error(err.response?.data?.message || 'Failed to load Wallet');
            } finally {
                setWalletLoading(false);
            }
        }
        fetchWallet();
    }, [activeSection, walletPage]);

    const handleProfileSave = async () => {
        setLoading(true);
        try {
            await updateProfile({
                name: profileData.name,
                phone: profileData.phone,
                profileImage: profileData.profileImage,
            });
            toast.success(MESSAGES.PROFILE_UPDATED);
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!passwordData.oldPassword) {
            toast.error("Please enter Old password");
            return;
        }
        if (!passwordData.newPassword) {
            toast.error("Plaease enter new password");
            return;
        }
        if (!passwordData.confirmPassword) {
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
            toast.success(MESSAGES.PASSWORD_CHANGED);
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>
            toast.error(err?.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('images', file);
        const API_URL = import.meta.env.VITE_API_URL;
        try {
            const res = await API.post(`${API_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const imageUrl = res.data.data.images[0].url;
            await updateProfile({
                name: profileData.name,
                phone: profileData.phone,
                profileImage: imageUrl,
            });
            setProfileData(prev => ({ ...prev, profileImage: imageUrl }));
            toast.success("Profile updated successfully");
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            toast.error(err.response?.data?.message || "Failed to upload photo");
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
                                    {!showAddressForm && (
                                        <button
                                            onClick={() => setShowAddressForm(true)}
                                            className="bg-[#1da1f2] hover:bg-[#1a91da] text-white font-semibold px-4 py-2 rounded-xl text-sm transition"
                                        >
                                            + Add Address
                                        </button>
                                    )}
                                </div>

                                {/* Add / Edit Form */}
                                {showAddressForm && (
                                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-6">
                                        <h3 className="font-semibold text-gray-700 mb-4">
                                            {editingAddress ? 'Edit Address' : 'New Address'}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                                                <select
                                                    value={addressForm.label}
                                                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value as AddressLabel })}
                                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1da1f2]"
                                                >
                                                    <option value="Home">🏠 Home</option>
                                                    <option value="Work">🏢 Work</option>
                                                    <option value="Other">📍 Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Pincode</label>
                                                <input
                                                    type="text"
                                                    value={addressForm.pincode}
                                                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                                                    placeholder="600001"
                                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1da1f2]"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Street / Area</label>
                                                <input
                                                    type="text"
                                                    value={addressForm.street}
                                                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                                    placeholder="123, Main Street, Anna Nagar"
                                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1da1f2]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                                                <input
                                                    type="text"
                                                    value={addressForm.city}
                                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                    placeholder="Kochi"
                                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1da1f2]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
                                                <input
                                                    type="text"
                                                    value={addressForm.state}
                                                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                                    placeholder="Kerala"
                                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1da1f2]"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-4">
                                            <button
                                                onClick={handleAddressSubmit}
                                                disabled={loading}
                                                className="bg-[#1da1f2] hover:bg-[#1a91da] text-white font-semibold px-5 py-2 rounded-xl text-sm transition disabled:opacity-60"
                                            >
                                                {loading ? 'Saving...' : editingAddress ? 'Update' : 'Save Address'}
                                            </button>
                                            <button
                                                onClick={resetAddressForm}
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2 rounded-xl text-sm transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Address Cards */}
                                {addresses.length === 0 && !showAddressForm ? (
                                    <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                        <div className="text-5xl mb-4">📍</div>
                                        <p className="text-gray-600 font-semibold">No addresses saved yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Add an address to use during checkout</p>
                                        <button
                                            onClick={() => setShowAddressForm(true)}
                                            className="mt-4 bg-[#1da1f2] text-white font-semibold px-5 py-2 rounded-xl text-sm hover:bg-[#1a91da] transition"
                                        >
                                            Add Your First Address
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {addresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                className={`p-4 rounded-xl border-2 transition ${addr.isDefault ? 'border-[#1da1f2] bg-blue-50' : 'border-gray-100 bg-white'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold bg-[#1da1f2]/10 text-[#1da1f2] px-2 py-0.5 rounded-full">
                                                            {addr.label}
                                                        </span>
                                                        {addr.isDefault && (
                                                            <span className="text-xs font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {!addr.isDefault && (
                                                            <button
                                                                onClick={() => handleSetDefault(addr.id)}
                                                                className="text-xs text-[#1da1f2] hover:underline font-medium"
                                                            >
                                                                Set Default
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleEditAddress(addr)}
                                                            className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmDeltedId(addr.id)}
                                                            className="text-xs text-red-400 hover:text-red-600 font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-700">{addr.street}</p>
                                                <p className="text-sm text-gray-500">{addr.city}, {addr.state} — {addr.pincode}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Wallet-Section  */}

                        {activeSection === "wallet" && (
                            <>
                                <div className="space-y-4">
                                    {/* Balance Card */}
                                    <div className="bg-gradient-to-r from-[#1da1f2] to-[#0d8ddc] rounded-2xl p-6 text-white shadow-md">
                                        <p className="text-sm text-white/80 font-medium">Available Balance</p>
                                        <p className="text-4xl font-bold mt-1">
                                            ₹{walletData?.wallet?.balance?.toFixed(2) || "0.00"}
                                        </p>
                                    </div>

                                    {/* Transactions */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <h3 className="font-bold text-gray-800 mb-4">Recent Transactions</h3>
                                        {walletLoading ? (
                                            <p className="text-center text-gray-400 py-8">Loading...</p>
                                        ) : walletData?.transactions && walletData.transactions.length > 0 ? (
                                            <>
                                                <div className="space-y-3">
                                                    {walletData.transactions.map((tx: TransactionItem) => (
                                                        <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                            <div>
                                                                <p className="font-semibold text-gray-700 text-sm capitalize">{tx.purpose?.replace('_', ' ')}</p>
                                                                <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                                                                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                                                                </p>
                                                                <p className="text-xs text-gray-400 uppercase">{tx.status}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Pagination
                                                    currentPage={walletPage}
                                                    totalPages={Math.ceil((walletData?.total || 0) / walletLimit)}
                                                    onPageChange={(page) => setWalletPage(page)}
                                                    variant ='light'
                                                />
                                            </>
                                        ) : (
                                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                                <div className="text-5xl mb-3">💸</div>
                                                <p className="text-gray-600 font-semibold">No transactions yet</p>
                                                <p className="text-sm text-gray-400 mt-1">Your payment history will appear here</p>
                                            </div>
                                        )}

                                        {/* {walletLoading ? (
                                        <p className="text-center text-gray-400 py-8">Loading...</p>
                                    ) : walletData?.transactions && walletData.transactions.map((tx: TransactionItem) => tx.status === 'completed').length > 0 ? (
                                        <div className="space-y-3">
                                            {walletData.transactions.filter((tx: TransactionItem) => tx.status === 'completed').map((tx: TransactionItem) => (
                                                <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                    <div>
                                                        <p className="font-semibold text-gray-700 text-sm capitalize">{tx.purpose?.replace('_', ' ')}</p>
                                                        <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                                                            {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                                                        </p>
                                                        <p className="text-xs text-gray-400 uppercase">{tx.status}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                            <div className="text-5xl mb-3">💸</div>
                                            <p className="text-gray-600 font-semibold">No transactions yet</p>
                                            <p className="text-sm text-gray-400 mt-1">Your payment history will appear here</p>
                                        </div>
                                    )} */}
                                    </div>
                                </div>

                                {/* <Pagination
                                    currentPage={walletPage}
                                    totalPages={Math.ceil(walletData?.total || 0) / walletLimit}
                                    onPageChange={(page) => setWalletPage(page)}
                                /> */}
                            </>
                        )}

                    </main>
                </div>
            </div>


            <ConfirmModal
                isOpen={!!confirmDeletedId}
                title="Delete Address"
                message="Are you sure to delete the address"
                onConfirm={handleDeleteAddress}
                onClose={() => setConfirmDeltedId(null)}
            />
            <Footer />

        </div>
    );
}
