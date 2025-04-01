import React from "react";
import { Outlet, Navigate } from "react-router-dom";

// Utility function to parse cookies
const getCookie = (cookieName) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((row) => row.startsWith(`${cookieName}=`));
    return cookie ? cookie.split("=")[1] : null;
};

const ProtectedRoutes = () => {
    // Retrieve the token from cookies
    const token = getCookie("token");

    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
