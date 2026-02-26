import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";


export default function RequireAuth({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    if (!isAuthenticated) {
        if (location.state?.loggedOut) {
            return <Navigate to="/home" replace />;
        }
        return <Navigate to="/user/login" replace state={{ from: location }} />;
    }
    return children;
}
