import { Outlet, Link, useLocation } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaGavel, FaUser, FaUsers } from "react-icons/fa";
import ModifyProfilPopUp from "../components/PopUp/ModifyProfilPopUp";
import ModifyTeamPopUp from "../components/PopUp/ModifyTeamPopUp";

const Layout = () => {
    const { currentUser, isLoading, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [displayModify, setDisplayModify] = useState(false);
    const [displayTeam, setDisplayTeam] = useState(false);

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
                                <div className="flex flex-row">
                                    <button onClick={() => !displayModify ? (setDisplayModify(true), setDisplayTeam(false)) : setDisplayModify(false)} className={`${displayModify ? "bg-[#303030]" : ""} w-[103px] py-2 rounded-md bg-[#202020] flex flex-row mr-4 items-center justify-center`}><FaUser className="mr-2"/>Profil</button>
                                    <button onClick={() => !displayTeam ? (setDisplayTeam(true), setDisplayModify(false)) : setDisplayTeam(false)} className={`${displayTeam ? "bg-[#303030]" : ""} w-[117px] py-2 rounded-md bg-[#202020] flex flex-row mr-4 items-center justify-center`}><FaUsers size={23} className="mr-2"/>Team</button>
                                    {currentUser?.right === "ROLE_ADMIN" && <button onClick={() => navigate("/administration")} className="px-5 py-2 rounded-md bg-[#202020] flex flex-row items-center"><FaGavel className="mr-2"/>Administration</button>}
                                    {currentUser?.right === "ROLE_MODERATOR" && <button onClick={() => navigate("/moderation")} className="px-5 py-2 rounded-md bg-[#202020] flex flex-row items-center"><FaGavel className="mr-2"/>Moderation</button>}
                                    {displayModify && <ModifyProfilPopUp />}
                                    {displayTeam && <ModifyTeamPopUp />}
                                </div>
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