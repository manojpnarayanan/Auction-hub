import { useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, } from "react-redux";
import { setCredentials } from "../redux/slices/authSlices";



export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch=useDispatch();

    useEffect(() => {
        const token = searchParams.get('token');
        const isNewUser = searchParams.get('isNewUser');
        const userParam=searchParams.get('user');
        if (token) {
            localStorage.setItem('token', token);
            if(userParam){
                const user=JSON.parse(decodeURIComponent(userParam));
                dispatch(setCredentials({user,token}));
            }
            navigate(isNewUser === 'true' ? '/user/dashboard' : '/user/dashboard')
        } else {
            navigate('/login?error=auth_failed')
        }
    }, [searchParams, navigate,dispatch]);
    return <div>Authenticating...</div>;
}