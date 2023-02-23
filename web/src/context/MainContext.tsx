import React from "react";
import AuthWrapper from "./AuthContext"

interface MainContextInterface {
    children: React.ReactNode;
}

const MainContext = ({ children }: MainContextInterface) => {
    return (
        <>
            <AuthWrapper>
                {children}
            </AuthWrapper>
        </>
    );
};

export default MainContext;
