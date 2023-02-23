import React, { useState } from "react";
import InputField from "../components/Utils/input";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const { register } = useAuth();
    const [valueUsername, setvalueUsername] = useState("");
    const [valueEmail, setvalueEmail] = useState("");
    const [valuePassword, setvaluePassword] = useState("");
    const [valuePasswordVerif, setvaluePasswordVerif] = useState("");

    const createUser = async () => {
        if (valuePassword == valuePasswordVerif) {
            let res = await register(valueEmail, valuePassword, valueUsername);
            console.log(res);
        }
    };

    const handleChildUsername = (value: string) => {
        setvalueUsername(value);
    }

    const handleChildEmail = (value: string) => {
        setvalueEmail(value);
    }

    const handleChildPassword = (value: string) => {
        setvaluePassword(value);
    }

    const handleChildPasswordVerif = (value: string) => {
        setvaluePasswordVerif(value);
    }

    return (
        <div className="w-[100vw] h-[100vh] flex flex-col items-center register-gradient">
            <div className="flex flex-row mt-10">
                <div className="w-full lg:w-2/4 xl:w-[600px] flex items-center justify-center py-10">
                    <h1 className="w-[400px] text-white">Register</h1>
                </div>
                <div className="xl:w-[600px] lg:w-2/4 md:hidden lg:flex"></div>
            </div>
            <div className="flex flex-row">
                <div className="w-full lg:w-2/4 xl:w-[600px] h-full flex items-center justify-center">
                    <div className="w-[400px] flex flex-col items-center drop-shadow-lg bg-white pt-10 pl-10 pr-10 rounded-xl">
                        <InputField callback={handleChildUsername} placeholder="Username" title="Username" type="text" />
                        <InputField callback={handleChildEmail} placeholder="Email" title="Email" type="text" />
                        <InputField callback={handleChildPassword} placeholder="Password" title="Password" type="password" />
                        <InputField callback={handleChildPasswordVerif} placeholder="Confirme password" title="Confirme password" type="password" />
                        <button className="w-[150px] h-[50px] bg-black text-white rounded-lg mt-10 mb-5" onClick={() => createUser()}>Register button</button>
                        <div className="p-5">
                            <Link to="/login">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}