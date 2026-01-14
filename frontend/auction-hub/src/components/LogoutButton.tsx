import { useDispatch, } from "react-redux";
import { logout } from "../redux/slices/authSlices";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LogoutButton() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const handleLogout = async () => {

        try {
            const token = localStorage.getItem("token");
            if (token) {
                await axios.post(`${API_URL}/user/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                })
            }
        } catch (error) {
            console.error("Logout Error", error)
        } finally {
            dispatch(logout());
            navigate('/login');
        }
    }
    return (
        <button onClick={handleLogout} className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-700 transition">
            Logout
        </button>
    )
}