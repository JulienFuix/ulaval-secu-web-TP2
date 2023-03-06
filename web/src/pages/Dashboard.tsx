import React, { useContext, useEffect, useState } from "react";
import Protected from "../components/Protected/protected";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/Utils/input";
import { FaPenNib } from "react-icons/fa";

function Dashboard() {
    const { currentUser } = useAuth();
    const [statusValue, setStatusValue] = useState("");
    const [statusFromStorage, setStatusFromStorage] = useState(localStorage.getItem("status"));

    function updateStatus() {
        setStatusFromStorage(localStorage.getItem("status"));
    }

    const handleChildStatus = (value: string) => {
        setStatusValue(value);
    }

    function addStatus() {
        localStorage.setItem("status", statusValue);
        updateStatus();
    }

    return (
        <div className="w-full flex justify-center disable-scroll-bar">
            <div className="w-[1100px] h-[calc(100vh-80px)] mt-[80px]">
                <h1 className="mt-10">User page</h1>
                <div className="mt-7 flex flex-row">
                    <p>User Email: </p>
                    <p className="ml-5">{currentUser.email}</p>
                </div>
                <div className="w-[500px] flex flex-row items-end mt-10">
                    <div className="w-[200px]"><InputField callback={handleChildStatus} placeholder="Your browser status" title="Status" type="text" /></div>
                    <button onClick={() => addStatus()} className="w-[240px] h-[40px] py-2 rounded-md bg-[#202020] flex flex-row ml-4 items-center justify-center"><FaPenNib size={16} className="mr-2"/>Set browser your status</button>
                </div>
                <div className="mt-7 flex flex-row">
                    <p>Your browser status is:</p>
                    <p className="ml-5">{statusFromStorage}</p>
                </div>
            </div>
        </div>
    );
}

export default Protected(Dashboard);