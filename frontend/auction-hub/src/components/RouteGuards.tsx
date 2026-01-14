import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";


export const PublicRoute = ({ children }: { children: React.ReactElement }) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    if (isAuthenticated && user?.id) {
        if (user.role === 'admin') {
            return <Navigate to='/admin/dashboard' replace />
        }
        return <Navigate to='/user/dashboard' replace />
    }
    return children;
}

export const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />
    }
    return children;
}

export const AdminRoute = ({ children }: { children: React.ReactElement }) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    if (!isAuthenticated) {
        return <Navigate to='/admin/login' replace />
    }
    if (user?.role !== 'admin') {
        return <Navigate to='/login' replace />
    }
    return children;
}