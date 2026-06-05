import React from "react";
import {assets} from "../../assets/assets.js"
import "./Reviews.css"

export default function Reviews(){
    return(
    <>
    <div className="allr" id="review">
        <h4>Customer Reviews</h4>
    <div className="reviews">
        <div className="review">
            <div className="r_img">
                <img src={assets.review1}/>
            </div>
            <div className="r_desc">
                <h4>Sarah Thompson</h4>
                <p>The recommendations have transformed our menu strategy. We're now able to predict popular
                     items and improve our sales!</p>
            </div>
        </div>

        <div className="review">
           <div className="r_img">
               <img src={assets.review2}/>
           </div>
           <div className="r_desc">
               <h4>David Patel</h4>
               <p>Fantastic insights! The dashboard is user-friendly, and the data visualization makes it easy
                 to understand customer trends. Highly recommended!</p>
           </div>
            
        </div>

        <div className="review">
           <div className="r_img">
              <img src={assets.review3}/>
           </div>
           <div className="r_desc">
               <h4>Emily Johnson</h4>
               <p>I love how the sentiment analysis gives us a clear picture of customer feedback. It has 
                helped us address issues promptly and improve service quality.</p>
           </div>
        </div>

        <div className="review">
           <div className="r_img">
              <img src={assets.review4}/>
           </div>
           <div className="r_desc">
               <h4>Michael Lee</h4>
               <p>The market basket analysis is a game-changer. We've been able to optimize our inventory and 
                reduce waste significantly. Great tool!</p>
           </div>
        </div>

    </div>
    </div>
    </>)
}