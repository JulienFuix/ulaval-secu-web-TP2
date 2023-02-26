import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Protected from "../components/Protected/protected";

function Home() {
    return (
        <div className="w-full flex justify-center disable-scroll-bar">
            <div className="w-[1100px] h-[calc(100vh-80px)] mt-[80px] px-4">
                <div className="w-full h-[80px] flex lg:hidden items-center justify-center">
                    <Link to="/register" className="active:scale-95 red-linear-bg rounded-lg px-10 py-2">Get started</Link>
                </div>
                <div className="w-full flex justify-center lg:justify-end items-center">
                    <Link to="/login"><p className="hover:underline">Connect to your account</p></Link>
                </div>
                <div className="w-full flex mt-14 lg:mt-25 lg:justify-start justify-center items-center">
                    <div className="w-[280px] lg:w-[530px] flex items-center">
                        <h1 className="text-[50px] lg:text-[90px]"><span className="text-[#FF3838]">C</span>ollaborate</h1>
                        <p className="absolute mt-[60px] lg:mt-[90px] text-lg">Agenda</p>
                    </div>
                </div>
                <div className="w-full flex justify-center lg:justify-end">
                    <img className="white-drop-shadow w-[250px] lg:w-[450px] mt-10 lg:mt-0 lg:mr-10" src="/images/home.png" alt="Agenda Logo" />
                </div>
            </div>
        </div>
    );
}

export default Home;