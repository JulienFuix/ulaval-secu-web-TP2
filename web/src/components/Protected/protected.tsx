import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Protected<T>(WrappedComponent: React.ComponentType<T>) {
    const Auth = (props: any) => {
        const { isAuthenticated, isLoading } = useAuth();
        const location = useLocation();
        const navigate = useNavigate();
        const [loaded, setLoaded] = useState(false);

        useEffect(() => {
            console.log("Protected", isLoading);
            if (!isLoading) {
                console.log("isAuth", isAuthenticated);
                if (!isAuthenticated) {
                    navigate("/");
                } else if ((location.pathname == "/login" || location.pathname == "/register") && isAuthenticated) {
                    navigate("/dashboard");
                } else {
                    setLoaded(true);
                }
            }
        }, [isLoading]);

        if (isLoading) {
            return <p>Loading</p>;
        }
        return loaded && <WrappedComponent {...props} />;
    };

  return Auth;
};

export default Protected;
