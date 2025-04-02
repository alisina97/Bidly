import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";  

const Navbar = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUserSession = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/users/me", {
                    withCredentials: true,
                });
                
                console.log("User session response:", response.data); // Debugging log

                if (response.data) {
                    setUserId(response.data.userId); // Adjust if your backend uses a different key
                    setIsLoggedIn(true);
                    setIsAdmin(response.data.isAdmin); 
                }
            } catch (error) {
                setUserId(null);
                setIsLoggedIn(false);
                setIsAdmin(false);
                console.error("Failed to fetch user session:", error);
            }
        };
        fetchUserSession();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/api/users/logout", {}, { withCredentials: true });
            setUserId(null);
            setIsLoggedIn(false);
            setIsAdmin(false);
            navigate("/login");
            window.location.reload();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleAuthAction = () => {
        if (isLoggedIn) {
            handleLogout();
        } else {
            navigate("/login");
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <ul className="nav-links">
                    <li><Link to="/home" className="nav-link">Home</Link></li>
                    <li>
                        <Link 
                            to={isLoggedIn ? "/sell" : "/login"} 
                            className="nav-link"
                        >
                            Sell
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to={isLoggedIn && userId ? `/myAuctions/${userId}` : "/login"} 
                            className="nav-link"
                        >
                            My Auctions
                        </Link>
                    </li>
                    
                    {/* NEW: "User Dashboard" link */}
                    <li>
                        <Link 
                            to={isLoggedIn ? "/userDash" : "/login"} 
                            className="nav-link"
                        >
                            User Dashboard
                        </Link>
                    </li>

                    {isAdmin && (
                        <li>
                            <Link to="/adminControlPanel" className="nav-link">
                                Admin Panel
                            </Link>
                        </li>
                    )}
                </ul>

                <button className="logout-btn" onClick={handleAuthAction}>
                    {isLoggedIn ? "Sign Out" : "Login/Register"}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
