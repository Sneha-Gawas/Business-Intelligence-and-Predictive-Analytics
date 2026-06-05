import "./Navbar.css";
import { assets } from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from 'react-router-dom';

export default function Navbar({ isLoggedIn, setIsLoggedIn, setIsLoginPopupVisible }) {
    const navigate = useNavigate();
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [passkey, setPasskey] = useState(""); 
    const [isFeedbackUser, setIsFeedbackUser] = useState(false); // Track feedback user login

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        setIsLoggedIn(false);
        setIsFeedbackUser(false); // Reset feedback user state on logout
        navigate("/");
    };

    
    const handleLogin = () => {
        const predefinedPassword = "password"; 
    
        if (passkey === predefinedPassword) { 
            setIsLoggedIn(true);
            setIsFeedbackUser(true); // Mark as feedback user
            setShowLoginPopup(false);
            setPasskey(""); // Clear the passkey input field
            navigate("/sentiment");
        } else {
            alert("Incorrect passkey!");
        }
    };
    
    
    return (
        <div className={`Navbar ${isFeedbackUser ? "Navbar-small" : ""}`}>
            {/* Left Section: Logo */}
            <div className="Nav-left">
                <img className="logo" src={assets.Coffe_Logo} alt="Coffee Logo" />
                <img className="logow" src={assets.coffee_w} alt="Coffee Logo White" />
            </div>

            {/* Center Section: Navigation Menu */}
            {!isLoggedIn && (
                <ul className="Nav-menu">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Insights Dashboard</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#contact">Contact Us</a></li>
                    <li><a href="#features">About Us</a></li>
                </ul>
            )}
            {isLoggedIn && !isFeedbackUser && (
                <ul className="Nav-menu">
                    <li><Link to="/welcome">Home</Link></li>
                    <li><a href="http://127.0.0.1:5001" target="_blank" rel="noopener noreferrer">Insights Dashboard</a></li>

                </ul>
            )}

            {/* Right Section: Login/Logout Button */}
            <div className="Navbar-right">
                {!isLoggedIn && (
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => setIsLoginPopupVisible(true)}>Sign Up</button>
                        {/*
                        <button onClick={() => setShowLoginPopup(true)}>Login</button>
                        */}
                    </div>
                )}
                {isLoggedIn && (
                    <button onClick={handleLogout}>Logout</button>
                )}
            </div>

            {/* Login Popup */}
            {showLoginPopup && (
                <div className="popup-overlay">
                    <div className="login-popup">
                        <div className="popup-content">
                            <h3>Login</h3>
                            <input
                                type="password"
                                placeholder="Enter Passkey"
                                value={passkey}
                                onChange={(e) => setPasskey(e.target.value)}
                            />
                            <div className="popup-buttons">
                                <button onClick={handleLogin}>Submit</button>
                                <button className="cancel-btn" onClick={() => setShowLoginPopup(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
