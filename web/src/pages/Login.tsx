import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/Utils/input";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const [valueUsername, setvalueUsername] = useState("");
    const [valuePassword, setvaluePassword] = useState("");

    const handleChildUsername = (value: string) => {
        setvalueUsername(value);
    }

    const handleChildPassword = (value: string) => {
        setvaluePassword(value);
    }

    const connectUser = async () => {
        console.log(valueUsername, valuePassword);
        let res = await login(valueUsername, valuePassword);
    };

    return (
        <div className="w-[100vw] h-[100vh] flex flex-col items-center login-gradient">
            <div className="flex flex-row mt-20">
                <div className="xl:w-[600px] lg:w-2/4 md:hidden lg:flex"></div>
                <div className="w-full lg:w-2/4 xl:w-[600px] flex items-center justify-center py-10">
                    <h1 className="w-[400px] text-white">Login</h1>
                </div>
            </div>
            <div className="flex flex-row">
                <div className="w-full lg:w-2/4 xl:w-[600px] h-full flex items-center justify-center">
                    <div className="w-[400px] flex flex-col items-center drop-shadow-lg bg-white pt-10 pl-10 pr-10 rounded-xl">
                        <InputField callback={handleChildUsername} placeholder="Username" title="Username" type="text" />
                        <InputField callback={handleChildPassword} placeholder="Password" title="Password" type="password" />
                        <button className="w-[150px] h-[50px] bg-black text-white rounded-lg mt-10 mb-5" onClick={() => connectUser()}>Login</button>
                        <div className="p-5">
                            <Link to="/register" className="active:scale-95 w-[100px] h-[40px] bg-black rounded-lg text-white flex justify-center items-center">Register</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
