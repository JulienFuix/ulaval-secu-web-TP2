import React from "react";
import { useAuth } from "../../context/AuthContext";
import { FaBoxOpen } from "react-icons/fa";

export default function ModifyTeamPopUp() {
    const { currentUser } = useAuth();

    return (
        <div className="w-[236px] h-[230px] absolute bg-[#202020] mt-[70px] rounded-md white-drop-shadow-modale">
            <div className="w-full h-[80px] flex justify-center items-center">
                <p className="text-xl">Team</p>
            </div>
            <div className="w-full h-[150px] flex justify-center items-center flex-row">
                <FaBoxOpen color="#D9A050" size={30}/>
                <p className="ml-3">Futur feature</p>
            </div>
        </div>
    )
}