import { Navigate, Outlet } from "react-router-dom";
import GenericLoader from "../components/GenericLoader";
import { useAuth } from "../hooks/AuthProvider";

const PublicRoute = () => {
    const { accessToken, isLoaded } = useAuth();

    if (!isLoaded) return <GenericLoader>Checking Authentication...</GenericLoader>;
    else if (accessToken) return <Navigate to="/" />;

    return <Outlet />;
};

export default PublicRoute;