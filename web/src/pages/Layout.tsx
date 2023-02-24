import { Outlet, Link, useLocation } from "react-router-dom";
import React, { useContext } from "react";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
    const { logout } = useAuth();
    const location = useLocation();

    return (
        <>
            <nav className="w-full h-[80px] fixed z-10 flex justify-center items-start backdrop-blur-md">
                <div className="w-[1400px] h-[80px]">
                    <div className="h-full w-full flex flex-row justify-between items-center px-4">
                        {location.pathname !== "/dashboard" &&
                            <Link to="/" className="w-full lg:w-[230px] flex justify-center items-center">
                                <img className="w-[200px] lg:w-full" src="/images/logo.png" alt="Agenda Logo" />
                            </Link>
                        }
                        {location.pathname === "/" && <Link to="/register" className="hidden lg:flex active:scale-95 red-linear-bg rounded-lg px-10 py-2">Get started</Link>}
                        {location.pathname === "/dashboard" && <button onClick={() => logout()}>Log Out</button>}
                    </div>
                </div>
            </nav>

            <Outlet />
        </>
    )
};

export default Layout;