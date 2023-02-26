import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/Utils/input";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AiFillCloseCircle, AiFillCheckCircle } from "react-icons/ai";

export default function Login() {
    const { login, returnMessage, returnCode, setReturnCode, setReturnMessage, isLoading, currentUser, isAuthenticated } = useAuth();
    const [valueUsername, setvalueUsername] = useState("");
    const [valuePassword, setvaluePassword] = useState("");
    const [warningMessage, setWarningMessage] = useState("");
    const navigate = useNavigate();

    const handleChildUsername = (value: string) => {
        setvalueUsername(value);
    }

    const handleChildPassword = (value: string) => {
        setvaluePassword(value);
    }

    const connectUser = async () => {
        console.log(valueUsername, valuePassword);
        if (valueUsername && valuePassword) {
            let res = await login(valueUsername, valuePassword);
        } else {
            setWarningMessage("Error: All fields are required.");
        }
    };

    useEffect(() => {
        setReturnCode(-1)
        setReturnMessage("")
        setWarningMessage("")
    }, []);

    useEffect(() => {
        console.log("code", returnCode);
        if (returnCode === 200) {
            setWarningMessage("Success: User was successfully found.");
        } else if (returnCode === 404) {
            setWarningMessage(returnMessage);
        } else {
            setWarningMessage("");
        }
    }, [returnCode])

    return (
        <div className="w-[100vw] h-[100vh] flex flex-col items-center login-gradient">
            <div className="flex flex-row mt-[80px] lg:mt-0">
                <div className="w-full h-screen xl:w-[600px] flex flex-col items-center justify-center">
                    <div>
                        <h1><span className="text-[#FF3838]">L</span>ogin</h1>
                    </div>
                    <div className="w-[370px] flex flex-col items-center pt-10 pl-10 pr-10">
                        <div className="w-full mt-4 mb-6">
                            <InputField callback={handleChildUsername} placeholder="Username" title="Username" type="text" />
                        </div>
                        <InputField callback={handleChildPassword} placeholder="Password" title="Password" type="password" />
                        <button className="active:scale-95 red-linear-bg rounded-lg mt-10 mb-5 w-[120px] flex justify-center items-center h-[40px]" onClick={() => connectUser()}>
                            {returnCode === 200 && <svg
                                className="animate-spin h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25 text-white"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>}
                            {returnCode !== 200 && <span>Login</span>}
                        </button>
                        {warningMessage === "" && <div className="w-[300px] h-[30px] mt-[10px] mb-5"></div>}
                        {warningMessage != "" && (
                            <div className={`flex items-center px-3 rounded-md border-[1px] ${returnCode !== 200 ? "bg-[#FEF1F2] text-[#9E2827]" : "bg-[#e1ffee] text-[#3ec877]"} text-xs w-[300px] h-[30px] mt-[10px] mb-5`}>
                                {returnCode !== 200 && <AiFillCloseCircle
                                    color="#F77171"
                                    size={18}
                                    onClick={() => setWarningMessage("")}
                                ></AiFillCloseCircle>}
                                {returnCode === 200 && <AiFillCheckCircle
                                    color="#3ec877"
                                    size={18}
                                    onClick={() => setWarningMessage("")}
                                ></AiFillCheckCircle>}
                                <p className="ml-2">{warningMessage}</p>
                            </div>
                        )}
                        <div className="pb-10">
                            <Link to="/register"><p className="hover:underline">Create a account here</p></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
