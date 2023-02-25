import React from 'react';
import MainContext from './context/MainContext';
import { Routes, Route } from "react-router-dom";
import Layout from './pages/Layout';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NoPage from "./pages/NoPage";
import Protected from './components/Protected/protected';

function App() {
    return (
        <MainContext>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </MainContext>
    );
}

export default App;
