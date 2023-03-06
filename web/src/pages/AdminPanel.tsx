import React, { useContext, useEffect } from "react";
import Protected from "../components/Protected/protected";
import { useAuth } from "../context/AuthContext";

function AdminPanel() {
    const { currentUser } = useAuth();

    return (
        <div className="w-full flex justify-center disable-scroll-bar">
            <div className="w-[1100px] h-[calc(100vh-80px)] mt-[80px]">
                <h1 className="mt-10">Admin Panel</h1>
                <p>{currentUser.role}</p>
            </div>
        </div>
    );
}

export default Protected(AdminPanel);