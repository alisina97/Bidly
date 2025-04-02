import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";  

const Navbar = () => {
    const navigate = useNavigate();
    // for login state
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchUserSession = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/users/me", {
                    withCredentials: true,
                });
                setUserId(response.data.user_id);
                setIsLoggedIn(true);
            } catch (error) { 
                // for invalid user sessions
                setUserId(null);
                setIsLoggedIn(false);
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
            navigate("/login");
            window.location.reload();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    // login button action
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
                    <li>
                        <Link to="/home" className="nav-link">Home</Link>
                    </li>
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
                    {/* NEW LINK to User Dashboard */}
                    <li>
                        <Link 
                            to={isLoggedIn ? "/userDash" : "/login"}
                            className="nav-link"
                        >
                            User Dashboard
                        </Link>
                    </li>
                </ul>
                <button className="logout-btn" onClick={handleAuthAction}>
                    {isLoggedIn ? "Sign Out" : "Login/Register"}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
