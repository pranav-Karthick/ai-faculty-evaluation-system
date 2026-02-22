import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // If logged in but role doesn't match, you might want to redirect to their dashboard 
        // or back to login. Let's redirect to login for safety/clarity.
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
