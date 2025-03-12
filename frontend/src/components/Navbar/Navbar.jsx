import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";  

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/api/users/logout", {}, { withCredentials: true });
            navigate("/login"); // Redirect to login page after logout
            window.location.reload(); // ✅ Ensure session is cleared and UI updates
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <ul className="nav-links">
                    <li><Link to="/home" className="nav-link">Home</Link></li>
                    <li><Link to="/sell" className="nav-link">Sell</Link></li>
                    <li><Link to="/myAuctions/:userId" className="nav-link">My Auctions</Link></li>
                </ul>
                <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
            </div>
        </nav>
    );
};

export default Navbar;
