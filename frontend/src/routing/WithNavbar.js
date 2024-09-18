import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const WithNavbar = ({ isRoute = true, children }) => {
    return (
        <>
            <div className="px-4 px-xxl-10">
                <Navbar />
                <div className="py-5">
                    {isRoute ? <Outlet /> : children}
                </div>
            </div>
        </>
    );
};

export default WithNavbar;