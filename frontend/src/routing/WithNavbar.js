import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const WithNavbar = ({ isRoute = true, children }) => {
    return (
        <>
            <Navbar />
            <div className="py-5">
                {isRoute ? <Outlet /> : children}
            </div>
        </>
    );
};

export default WithNavbar;