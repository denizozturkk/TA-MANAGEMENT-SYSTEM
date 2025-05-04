import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const token = localStorage.getItem('authToken');
    const role  = localStorage.getItem('userRole');

    console.log('🔒 ProtectedRoute:', {
        tokenExists: !!token,
        userRole:    role,
        allowedRoles
    });

    if (!token) {
        console.log('↩️  Not authenticated → /login');
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length && !allowedRoles.includes(role)) {
        console.log(`⛔ Unauthorized role (“${role}”) → /login`);
        return <Navigate to="/login" replace />;
    }

    console.log('✅ Authorized → rendering child routes');
    return <Outlet />;
};

export default ProtectedRoute;