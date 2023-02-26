import React from "react";
import { useAuth } from "../../context/AuthContext";
import { FaBoxOpen } from "react-icons/fa";

export default function ModifyProfilPopUp() {
    const { logout } = useAuth();

    return (
        <div className="w-[236px] h-[290px] absolute bg-[#202020] mt-[70px] rounded-md white-drop-shadow-modale">
            <div className="w-full h-[80px] flex justify-center items-center">
                <p className="text-xl">Modify Profil</p>
            </div>
            <div className="w-full h-[150px] flex justify-center items-center flex-row">
                <FaBoxOpen color="#D9A050" size={30} />
                <p className="ml-3">Futur feature</p>
            </div>
            <div className="w-full h-[60px] flex justify-center items-center">
                <button className="hover:underline" onClick={() => logout()}>Log Out</button>
            </div>
        </div>
    )
}