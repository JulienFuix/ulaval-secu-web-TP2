import React, { useEffect, useState } from "react";
import InputField from "../components/Utils/input";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AiFillCloseCircle, AiFillCheckCircle } from "react-icons/ai";
import validator from 'validator';

export default function Register() {
    const { register, returnMessage, returnCode, setReturnCode, setReturnMessage } = useAuth();
    const [valueUsername, setvalueUsername] = useState("");
    const [valueEmail, setvalueEmail] = useState("");
    const [valuePassword, setvaluePassword] = useState("");
    const [valuePasswordVerif, setvaluePasswordVerif] = useState("");
    const [validityUsername, setValidityUsername] = useState(false);
    const [validityEmail, setValidityEmail] = useState(false);
    const [validityPassword, setValidityPassword] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");

    const createUser = async () => {
        if (valuePassword !== valuePasswordVerif) {
            setWarningMessage("Error: Passwords must be the same.");
        }
        if (validityPassword === false) {
            setWarningMessage("Error: Password must be valid.");
        }
        if (validityEmail === false) {
            setWarningMessage("Error: Email must be valid and contain 1 and 50 characters.");
        }
        if (validityUsername === false) {
            setWarningMessage("Error: Username must contain 1 and 20 characters.");
        }
        if (!valueUsername || !valueEmail || !valuePassword || !valuePasswordVerif) {
            setWarningMessage("Error: All fields are required.");
        }
        if (valueUsername && valueEmail && valuePassword && valuePasswordVerif) {
            if (valuePassword === valuePasswordVerif) {
                if (validityUsername === true && validityEmail === true && validityPassword === true) {
                    let res = await register(valueEmail, valuePassword, valueUsername);
                }
            }
        }
    };

    const handleChildUsername = (value: string) => {
        if (value.length < 20 && value.length > 2) {
            setValidityUsername(true);
        } else {
            setValidityUsername(false);
        }
        setvalueUsername(value);
    }

    const handleChildEmail = (value: string) => {
        if (value.length < 50 && value.length > 0 && validator.isEmail(value)) {
            setValidityEmail(true);
        } else {
            setValidityEmail(false);
        }
        setvalueEmail(value);
    }

    const handleChildPassword = (value: string) => {
        if (value.length < 20 && value.length > 0) {
            setValidityPassword(true);
        } else {
            setValidityPassword(false);
        }
        setvaluePassword(value);
    }

    const handleChildPasswordVerif = (value: string) => {
        setvaluePasswordVerif(value);
    }

    useEffect(() => {
        setReturnCode(-1)
        setReturnMessage("")
    }, []);

    useEffect(() => {
        setWarningMessage(returnMessage);
        if (returnCode === 200) {
            setTimeout(() => {
                setWarningMessage("");
                setReturnMessage("");
                setReturnCode(-1);
            }, 3000);
        }
    }, [returnCode]);

    return (
        <div className="w-[100vw] h-[100vh] flex flex-col items-center register-gradient">
            <div className="flex flex-row mt-[80px] lg:mt-0">
                <div className="w-full h-screen xl:w-[700px] flex flex-col items-center justify-center mt-20 mb-10 lg:mt-0 lg:mb-0">
                    <div>
                        <h1><span className="text-[#FF3838]">C</span>reate</h1>
                    </div>
                    <div className="w-[370px] lg:w-[700px] flex flex-col items-center pt-10 pl-10 pr-10">
                        <div className="flex flex-col lg:flex-row w-full">
                            <div className="w-full lg:w-2/4 lg:mr-4 mt-4 mb-4">
                                <div className="w-full mb-6 lg:mb-10">
                                    <InputField callback={handleChildUsername} placeholder="Username" title="Username" type="text" />
                                </div>
                                <div className="w-full mt-4">
                                    <InputField callback={handleChildEmail} placeholder="Email" title="Email" type="text" />
                                </div>
                            </div>
                            <div className="w-full lg:w-2/4 lg:ml-6 mt-4 mb-4">
                                <div className="w-full mb-6 lg:mb-10">
                                    <InputField callback={handleChildPassword} placeholder="Password" title="Password" type="password" />
                                </div>
                                <div className="w-full mt-4">
                                    <InputField callback={handleChildPasswordVerif} placeholder="Confirme password" title="Confirme password" type="password" />
                                </div>
                            </div>
                        </div>
                        <button className="active:scale-95 red-linear-bg rounded-lg mt-10 mb-5 px-10 py-2" onClick={() => createUser()}>Create account</button>
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
                            <Link to="/login"><p className="hover:underline">Connect to your account here</p></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}