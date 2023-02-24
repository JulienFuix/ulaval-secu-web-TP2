import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import User from "../types/User";
import axios from 'axios';

interface AuthWrapperInterface {
    children: React.ReactNode;
}

interface AuthContextInterface {
    login: (username: string, password: string) => any;
    register: (email: string, password: string, username: string) => any;
    autoLogin: () => any;
    logout: () => any;
    currentUser: undefined | User;
    isAuthenticated: boolean;
    isLoading: boolean;
    isAdmin: boolean;
    isModerator: boolean;
    returnMessage: string;
    returnCode: number;
    setReturnCode: (number: number) => any;
    setReturnMessage: (message: string) => any;
}

const AuthContext = createContext({} as AuthContextInterface);

export const AuthWrapper = ({ children }: AuthWrapperInterface) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentUser, setCurrentUser] = useState<undefined | User>(undefined);
    const [err, setErr] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModerator, setIsModerator] = useState(false);
    const [returnMessage, setReturnMessage] = useState("");
    const [returnCode, setReturnCode] = useState(-1);

    useEffect(() => {
        console.log("useEffect");
        autoLogin();
    }, []);

    const setRoleOfUser = (roles: any) => {
        roles.map((role: any, index: number) => {
            switch(role) {
                case "ROLE_ADMIN":
                    setIsAdmin(true);
                    break;
                case "ROLE_MODERATOR":
                    setIsAdmin(true);
                    setIsModerator(true);
                    break;
                default:
                    setIsAdmin(false);
                    setIsModerator(false);
            }
        });
    };

    const autoLogin = async () => {
        console.log("Call Autologin");
        try {
            setIsLoading(true);
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/auth/autologin',
                headers: { 'Content-Type': 'application/json', },
                data: "",
                withCredentials: true
            })
            .then(async (response) => {
                console.log("response", response.status, response)
                if (response.data != undefined) {
                    if (response.status == 200) {
                        console.log("autologin", response.data);
                        setCurrentUser(response.data);
                        setRoleOfUser(response.data.roles);
                        setIsLoading(false);
                        if (location.pathname == "/login" || location.pathname == "/register") {
                            navigate("/dashboard");
                        }
                    } else {
                        console.log("remove user");
                        navigate("/login");
                        setCurrentUser(undefined);
                        setIsLoading(false);
                    }
                } else {
                    navigate("/");
                    console.error("Error: response.json");
                }
            });
            setIsLoading(false);
        } catch (e: any) {
            console.log("error", e);
            setIsLoading(false);
        }
        setIsLoading(false);
    }

    const login = async (
        username: string,
        password: string
    ) => {
        console.log("Call Login", username, password);
        try {
            setIsLoading(true);
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/auth/signin',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    "username": username,
                    "password": password
                }),
                withCredentials: true
            }).then(response => {
                if (response.data !== undefined) {
                    console.log("test", response.data);
                    setReturnMessage(response.data.message);
                    setReturnCode(200);
                    setRoleOfUser(response.data.roles);
                    setCurrentUser(response.data);
                } else {
                    setReturnMessage("Error: User not found.");
                    setReturnCode(404)
                }
            }).catch(error => {
                console.error('Error:', error);
                setReturnMessage("Error: User not found.");
                setReturnCode(404)
            });
            setIsLoading(false);
        } catch (e: any) {
            console.log("error", e);
            setReturnMessage("Error: User not found.");
            setReturnCode(404)
            setIsLoading(false);
        }
    }


    const register = async (
        email: string,
        password: string,
        username: string
    ) => {
        console.log("Call Register", username, email, password, username);
        try {
            setIsLoading(true);
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/auth/signup',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    "username": username,
                    "email": email,
                    "password": password,
                }),
                withCredentials: true
            }).then(response => {
                console.log("res", response);
                if (response.data !== undefined) {
                    console.log("message", response.data.message);
                    setReturnMessage(response.data.message);
                    setReturnCode(200)
                } else {
                    setReturnMessage("error success");
                    setReturnCode(400)
                }
            });
            setIsLoading(false);
        } catch (e: any) {
            console.log("catch error", e);
            setIsLoading(false);
            setReturnMessage(e.response.data.message);
            setReturnCode(401)
        }
    };

    const logout = async () => {
        console.log("Call Log out");
        try {
            setIsLoading(true);
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/auth/signout',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: '',
                withCredentials: true
            }).catch((err) => {
                console.log(err);
            }).then(async () => {
                console.log("Log out");
                setIsAdmin(false);
                setIsModerator(false);
                setCurrentUser(undefined);
                setErr(false);
                navigate("/");
            });
            setIsLoading(false);
        } catch (e: any) {
            console.log("error", e);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        console.log("currentUserUseEffect", currentUser);
        if (currentUser) {
            navigate("/dashboard");
        }
    }, [currentUser]);

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                login,
                autoLogin,
                register,
                logout,
                isAuthenticated: currentUser ? true : false,
                isLoading,
                isAdmin,
                isModerator,
                returnMessage,
                returnCode,
                setReturnCode,
                setReturnMessage
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthWrapper;
export function useAuth(): AuthContextInterface {
    return useContext(AuthContext);
}
