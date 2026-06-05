import React from "react"
import "./Guide.css"

export default function Guide(){
    return(
<div className="guide">
    <h2>How It Works?</h2>
    <div className="steps-grid">
        <div className="step">
          {/* <img src={assets.loginIcon} alt="Login" /> */}
          <h3>Step 1: Log In</h3>
          <p>Create an account or log in to access insights.</p>
        </div>

        <div className="step">
          {/* <img src={assets.analysisIcon} alt="Performance" /> */}
          <h3>Step 2: Product Analysis</h3>
          <p>See sentiment analysis (positive, neutral, negative feedback).</p>
        </div>

        <div className="step">
          {/* <img src={assets.recommendIcon} alt="Recommendations" /> */}
          <h3>Step 3: Smart Recommendations</h3>
          <p>AI suggests product combos based on buying patterns.</p>
        </div>

        <div className="step">
          {/* <img src={assets.dashboardIcon} alt="Dashboard" /> */}
          <h3>Step 4: Business Insights</h3>
          <p>View top-selling products, trends, and payment breakdown.</p>
        </div>

        <div className="step">
          {/* <img src={assets.growthIcon} alt="Growth" /> */}
          <h3>Step 5: Grow Your Business</h3>
          <p>Make better decisions and boost your sales with data insights.</p>
        </div>
    </div>
    </div>
    )
}