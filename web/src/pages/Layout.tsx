import { Outlet, Link, useLocation } from "react-router-dom";
import React, { useContext } from "react";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
    const { logout } = useAuth();
    const location = useLocation();

    return (
        <>
            <nav className="w-full h-[80px] backdrop-blur-md fixed z-10 flex justify-center items-start">
                <div className="w-[1400px] h-[80px]">
                    <div className="h-full w-full flex flex-row justify-between items-center px-4">
                        {location.pathname !== "/dashboard" &&
                            <Link to="/" className="active:scale-95 w-[100px] h-[40px] bg-black rounded-lg text-white flex justify-center items-center">Home</Link>
                        }
                        {location.pathname === "/" && <Link to="/register" className="active:scale-95 w-[100px] h-[40px] bg-black rounded-lg text-white flex justify-center items-center">Get started</Link>}
                        {location.pathname === "/dashboard" && <button onClick={() => logout()}>Log Out</button>}
                    </div>
                </div>
            </nav>

            <Outlet />
        </>
    )
};

export default Layout;