import React from 'react';
import {assets} from "../../assets/assets.js"
import "./Feature.css"

export default function Feature() {
  return (
    <>
    <div className="features" id='features'>
      
       <div className="feature" id="feature">
           <div className="f_img">
              <img src={assets.market}></img>
           </div>
           <div className="f_desc">
              <h4>Market Basket Analysis</h4>
              <p>Market basket analysis examines customer buying patterns to identify combinations of products
                 frequently purchased together. For Cafe, this helps understand customer preferences, optimize 
                 menu offerings, create effective combos, and increase sales by promoting popular item pairings.</p>
           </div>
       </div>

       <div className="feature">
          <div className="f_img">
            <img src={assets.sentiment}></img>
          </div>
          <div className="f_desc">
            <h4>Sentiment Analysis</h4>
            <p>Sentiment analysis examines customer reviews to gauge overall satisfaction. Our Website helps 
              Cafe owners understand customer preferences, improve services and dining experience, and make 
              informed decisions, leading to better customer experiences and increased business growth.</p>
          </div>

       </div>


       <div className="feature">
          <div className="f_img">
            <img src={assets.ai}></img>
          </div> 
          <div className="f_desc">
            <h4>Recommendation System</h4>
            <p>It uses sentiment analysis to find popular dishes and market basket analysis to identify 
              frequently bought item combinations. This helps café owners create a menu that features customer 
              favorites, popular combos, and optimized offerings to boost satisfaction and sales.</p>
          </div>
       </div>

    </div>
    </>
  );
}