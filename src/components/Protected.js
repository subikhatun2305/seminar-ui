import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const PrivateRoutes = () => {
    const isAuthenticated = !!document.cookie.includes('token=');
    const location = useLocation();

    const isLoginRoute = () => {
        return location.pathname === '/';
    };

    if (!isLoginRoute() && !isAuthenticated) {
        // Store the current location to redirect back after login
        localStorage.setItem('redirectPath', location.pathname);
        return <Navigate to="/" />;
    }

    const redirectPath = localStorage.getItem('redirectPath');
    if (isAuthenticated && redirectPath) {
        localStorage.removeItem('redirectPath');
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default PrivateRoutes;
