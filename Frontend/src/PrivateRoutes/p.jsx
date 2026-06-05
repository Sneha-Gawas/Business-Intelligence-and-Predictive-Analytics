import React from "react";
import { Route, Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = ({ isLoggedIn }) => {
    return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
