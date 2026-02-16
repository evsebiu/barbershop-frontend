import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Verificăm dacă există un indicator de login (salvat la login)
    // Atenție: Aici verifici doar dacă userul "zice" că e logat.
    // Securitatea reală e dată de Back-End care va refuza datele dacă token-ul/sesiunea nu e validă.
    const isAuthenticated = localStorage.getItem("isLoggedIn") === "true"; 
    // Sau verifici cookie-ul, sau starea din Context

    if (!isAuthenticated) {
        // Dacă nu e logat, îl trimitem înapoi la login
        return <Navigate to="/login" replace />;
    }

    // Dacă e logat, îl lăsăm să vadă conținutul (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;