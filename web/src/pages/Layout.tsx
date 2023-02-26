import { Outlet, Link, useLocation } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Layout = () => {
    const { logout, currentUser, isLoading, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) console.log("role user", currentUser?.role);
    }, [isLoading])

    return (
        <>
            <nav className="w-full h-[80px] fixed z-10 flex justify-center items-start backdrop-blur-md">
                <div className="w-[1100px] h-[80px] px-4">
                    <div className="h-full w-full flex flex-row justify-between items-center">
                        <Link to={`${isAuthenticated ? "/dashboard" : "/"}`} className="w-full lg:w-[230px] flex justify-center items-center"><img className="w-[200px] lg:w-full" src="/images/logo.png" alt="Agenda Logo" /></Link>
                        {location.pathname === "/" && <Link to="/register" className="hidden lg:flex active:scale-95 red-linear-bg rounded-lg px-10 py-2">Get started</Link>}
                        {location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/" &&
                            <div>
                                {currentUser?.email}
                                <button onClick={() => logout()}>Log Out</button>
                                {currentUser?.right === "ROLE_ADMIN" && <button onClick={() => navigate("/administration")}>Admin</button>}
                                {currentUser?.right === "ROLE_MODERATOR" && <button onClick={() => navigate("/moderation")}>Modo</button>}
                            </div>
                        }
                    </div>
                </div>
            </nav>

            <Outlet />
        </>
    )
};

export default Layout;