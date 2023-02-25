import React, { useContext, useEffect } from "react";
import Protected from "../components/Protected/protected";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { currentUser } = useAuth();

    return (
        <div className="w-full flex justify-center disable-scroll-bar">
            <div className="w-[1100px] h-[calc(100vh-80px)] mt-[80px]">
                User page
                <p>{currentUser.email}</p>
            </div>
        </div>
    );
}

export default Protected(Dashboard);