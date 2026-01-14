import { useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom'



export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const isNewUser = searchParams.get('isNewUser');
        if (token) {
            localStorage.setItem('token', token);
            navigate(isNewUser === 'true' ? '/user/dashboard' : '/user/dashboard')
        } else {
            navigate('/login?error=auth_failed')
        }
    }, [searchParams, navigate])
    return <div>Authenticating...</div>;
}