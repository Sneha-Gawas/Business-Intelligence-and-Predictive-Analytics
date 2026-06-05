import React, { useState } from "react";
import { assets } from "../../assets/assets.js";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLoggedIn, setIsLoginPopupVisible }) {
    let [loginState, setLoginState] = useState("Login");
    let [data, setData] = useState({
        username: "",
        password: "",
        email: "",
    });
    let [agreeTerms, setAgreeTerms] = useState(false); // New state for checkbox

    const navigate = useNavigate();

    const onChaneHandeler = (event) => {
        setData((data) => ({ ...data, [event.target.name]: event.target.value }));
    };

    const handleCheckboxChange = (event) => {
        setAgreeTerms(event.target.checked); // Set checkbox value
    };

    const submitForm = async (event) => {
        event.preventDefault(); // Prevent page reload
        if (!agreeTerms) {
            alert("You must agree to the terms of use and privacy policy to proceed.");
            return; // Exit the function if the checkbox is not selected
        }
        try {
            let response;
            if (loginState === "Login") {
                response = await axios.post("http://localhost:8080/api/auth/login", data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                console.log("Login successful:", response.data);
                console.log("Received body",response);
                if (response.data.success) {
                    // Store both username and token in localStorage
                    localStorage.setItem('username', data.username);
                    if (response.data.token) {
                        localStorage.setItem('token', response.data.token);
                    }
                    setIsLoggedIn(true); // Update the logged-in state
                    setIsLoginPopupVisible(false); // Hide login popup after successful login
                    navigate("/welcome"); // Redirect to a welcome page after successful login
                }
            } else {
                response = await axios.post("http://localhost:8080/signup", data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                console.log("Registration successful:", response.data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="login">
            <form className="login-form" onSubmit={submitForm}>
                <div className="login-popup-title">
                    <p>{loginState}</p>
                    <img 
                        onClick={() => setIsLoginPopupVisible(false)} // Close the popup
                        src={assets.cross_icon} 
                    />
                </div>

                <div className="credentials">
                    <div className="credentials">
                        <label htmlFor="username"><b>Username:</b></label>
                        <input placeholder="Enter Username" name="username" id="username" type="text" value={data.username} autoComplete="username" onChange={onChaneHandeler} />
                    </div>

                    {loginState === "Login" ? null : (
                        <div className="credentials">
                            <label htmlFor="email"><b>E-mail:</b></label>
                            <input placeholder="Enter E-mail" name="email" id="email" type="email" value={data.email} onChange={onChaneHandeler} />
                        </div>
                    )}

                    <label htmlFor="password"><b>Password:</b></label>
                    <input placeholder="Enter Password" name="password" id="password" type="password" value={data.password} autoComplete={loginState === "Login" ? "current-password" : "new-password"} onChange={onChaneHandeler} />
                
                </div>
               
                <div className="login-popup-condition">
                    <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={handleCheckboxChange}
                    />
                    <p>By continuing, I agree to the terms of use and privacy policy</p>
                </div>
                <button className="button1">{loginState === "Login" ? "Login" : "Create an account"}</button>
                {loginState === "Login" ? (
                    <p>Create an account <span onClick={() => setLoginState("Sign Up")}><b>Click here</b></span></p>
                ) : (
                    <p>Already have an account <span onClick={() => setLoginState("Login")}><b>Click here</b></span></p>
                )}
            </form>
        </div>
    );
}
