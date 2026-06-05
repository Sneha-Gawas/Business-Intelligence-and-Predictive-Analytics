import React from "react"
import Header from "../../components/Header/Header.jsx"
import Feature from "../../components/Features/Feature.jsx"
import Reviews from "../../components/Reviews/Reviews.jsx"
import Footer from "../../components/Footer/Footer.jsx"
import Contact from "../../components/Contact/Contact.jsx"
import Guide from "../../components/Guide/Guide.jsx"
export default function Home(){
    return(
        <>
        <Header/>
        <Feature/>
        <Guide/>
        <Reviews/>
        <Contact/>
        <Footer/>
        </>
    )
}