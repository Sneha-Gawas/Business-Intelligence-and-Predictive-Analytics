import React from "react";
import { assets } from "../../assets/assets.js";
import "./Contact.css"

export default function Contact(){
    return(
        <>
        <div id="contact">
        <h1>Contact Us</h1>
        <div className="contact_us" >
            <div className="team_photo">
                <img src={assets.team_photo}/>
            </div>
            <div className="contact-form">
                <form className="contact-form">
                    <div className="deatil">
                    <label htmlFor="name"><b>Name:</b></label>
                    <input placeholder="Enter your name" type="text" name="name" id="name"/>
                    </div>

                    <div className="deatil">
                        <label htmlFor="email"><b>E-mail:</b></label>
                        <input placeholder="Enter your E-mail" type="email" name="email" id="email"/>
                    </div>

                    <div className="deatil">
                        <label htmlFor="c_no"><b>Contact No:</b></label>
                        <input placeholder="Enter your Contact No." name="c_no" id="c_no" type="Number"/>
                    </div>

                    <div className="deatil">
                        <label htmlFor="c_name"><b>Cafe Name:</b></label>
                        <input placeholder="Enter your Cafe Name" name="c_name" id="c_name" type="text"/>
                    </div>
                    
                    <button className="btn btn-success">Submit</button>
                </form>
            </div>
        </div>
        </div>
        </>
    )
}