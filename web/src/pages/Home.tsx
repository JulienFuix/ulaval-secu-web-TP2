import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="w-full flex justify-center disable-scroll-bar">
            <div className="w-[1100px] h-[calc(100vh-80px)] mt-[80px]">
                <div className="w-full h-[80px] flex lg:hidden items-center justify-center">
                    <Link to="/register" className="active:scale-95 red-linear-bg rounded-lg px-10 py-2">Get started</Link>
                </div>
                Home page
            </div>
        </div>
    );
}