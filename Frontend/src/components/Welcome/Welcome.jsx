import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './w.css'
import { assets } from "../../assets/assets.js";

function Welcome() {
    const username = localStorage.getItem('username');
    const navigate = useNavigate();
    const location = useLocation();
    const [loggedIn, setLoggedIn] = useState(false);

    // Utility to check if JWT is expired
    function isTokenValid(token) {
      if (!token) return false;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
      } catch (e) {
        return false;
      }
    }

    // Read loggedIn from query param if present
    useEffect(() => {
        const token = localStorage.getItem('token');
        setLoggedIn(isTokenValid(token));
        console.log("Current username:", username);
    }, [username]);

    // Navigation functions for each button
    const goToTransactions = () => navigate("/transactions");
    const goToReviews = () => navigate("/reviews");
    const goToSentiment = () => {
        const token = localStorage.getItem('token');
        if (isTokenValid(token)) {
            setLoggedIn(true);
            navigate("/s");
        } else {
            setLoggedIn(false);
            localStorage.removeItem('token');
            window.location.href = "http://localhost:5173/login";
        }
    };
    const goToRecommend = () => {
        const token = localStorage.getItem('token');
        if (isTokenValid(token)) {
            setLoggedIn(true);
            navigate("/recommend");
        } else {
            setLoggedIn(false);
            localStorage.removeItem('token');
            window.location.href = "http://localhost:5173/login";
        }
    };
    
    const handleNavigation = async () => {
  const token = localStorage.getItem('token');
  if (!isTokenValid(token)) { /* redirect to login */ return; }

  await fetch('http://localhost:8080/set_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ token })
  });

  // Optional: remove token from localStorage for safety
  localStorage.removeItem('token');

  window.location.href = 'http://localhost:8080/dash/';
};
  const Navigation = async () => {
  const token = localStorage.getItem('token');
  if (!isTokenValid(token)) { /* redirect to login */ return; }

  await fetch('http://localhost:8080/set', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ token })
  });

  // Optional: remove token from localStorage for safety
  localStorage.removeItem('token');

  window.location.href = 'http://localhost:8080/inventory/';
};
    return (
        <div className="welcome-page">
            <h1>Welcome, {username ? username : "Guest"}!</h1>
            {loggedIn ? (
                <p>You have successfully logged in.</p>
            ) : (
                <p>Please log in to access your account.</p>
            )}

            {/* Debugging: Ensure the buttons are being displayed */}
            {loggedIn && (
                <div className="dashboard">
                    <div className="featured" onClick={goToSentiment}>
                        <img src={assets.Product_Performance}/>
                        <h5>Product Performance</h5>
                        <p>We analyze customer reviews to understand opinions about each product. 
                            A pie chart shows the percentage of positive, negative, and neutral reviews.
                        </p>
                    </div>
                    <div className="featured" onClick={goToRecommend}>
                        <img src={assets.mba1}/>
                        <h5>Product Recommendation</h5>
                        <p>Based on customer buying patterns, we suggest the best product combinations. 
                            This helps customers find products they are likely to buy together.
                        </p>
                    </div>
                    <div className="featured"  onClick={handleNavigation}>
                        <img src={assets.Analytic_Dashboard} />
                        <h5>Analytic Dashboard</h5>
                        <p>We provide insights like top-selling products, sales trends over months,
                        and payment method distribution, helping businesses make informed decisions.
                        </p>
                    </div>
                     <div className="featured" onClick={Navigation}>
                        <img src={assets.inventory}/>
                        <h5>Inventory insights</h5>
                        <p>The inventory insights dashboard helps business owners understand demand patterns influenced by seasonality, weather, and festivals. It provides reliable forecasts to optimize stock levels.
                        </p>
                    </div>
                </div>
            )}
            {/*
            {username && (
                <div className="navigation-buttons">
                    
                    <button onClick={goToSentiment}>Product Performance</button>
                    <button onClick={goToRecommend}>Product Recommendations</button>
                    <button onClick={handleNavigation}>Analytic Dashboard</button>
                    
                    <button onClick={goToTransactions}>Go to Transactions</button>
                    <button onClick={goToReviews}>Go to Reviews</button> 
                </div>
            )} */}
        </div>
    );
}

export default Welcome;
