import React from 'react';
import { Routes, Route } from "react-router-dom";
import Layout from '../../pages/Layout';
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import Dashboard from "../../pages/Dashboard";
import NoPage from "../../pages/NoPage";
import MainContext from '../../context/MainContext';
import { useAuth } from "../../context/AuthContext";
import { useEffect } from 'react';

const ProtectedRouter = () => {
    const { isAuthenticated, currentUser, isLoading } = useAuth();
    
    useEffect(() => {
        console.log("user", currentUser, isAuthenticated);
    }, [currentUser])

    return (
        <MainContext>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    {isAuthenticated && <Route path="dashboard" element={<Dashboard />} />}
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </MainContext>
    );
}

export default ProtectedRouter;
