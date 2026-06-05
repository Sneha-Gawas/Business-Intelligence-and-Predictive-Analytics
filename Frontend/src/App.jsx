import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./pages/Home/Home.jsx";
import Welcome from "./components/Welcome/Welcome.jsx";
import Login from "./components/Login/Login.jsx";
import SentimentForm from "./Sentiment/sentiments.jsx";
import ReviewForm from "./Rtable/r.jsx";
import TransactionForm from "./Transaction/tform.jsx";
import RecommendationForm from "./generatemenu/menu.jsx";
import PrivateRoutes from "./PrivateRoutes/p.jsx";
import SentimentAnalysis from "./Analysis/s.jsx";
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in
    const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false); 
    const handleLogout = () => {
        setIsLoggedIn(false); // Update logged-in state
        localStorage.removeItem("userToken"); // Clear authentication data
        localStorage.removeItem("userData");  // Optional: Clear user details
    };// Track visibility of login popup

    return (
        <>
            <Navbar 
                isLoggedIn={isLoggedIn} 
                setIsLoggedIn={setIsLoggedIn} 
                setIsLoginPopupVisible={setIsLoginPopupVisible} // Pass the function to control popup
            />
            {/* Render Login popup only if it's visible */}
            {isLoginPopupVisible && (
                <Login 
                    setIsLoggedIn={setIsLoggedIn} 
                    setIsLoginPopupVisible={setIsLoginPopupVisible} // Pass this to close the popup
                />
            )}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<PrivateRoutes isLoggedIn={isLoggedIn}/>}>
                <Route path="/welcome" element={<Welcome />} /> 
                <Route path="/sentiment" element={<SentimentForm />} />
                <Route path="/s" element={<SentimentAnalysis/>} />
                <Route path="/reviews" element={<ReviewForm/>} /> 
                <Route path="/transactions" element={<TransactionForm/>}/>
                <Route path="/recommend" element={<RecommendationForm/>} />
                </Route>
                  {/* Add this route */}
            </Routes>
        </>
    );
}

export default App;
