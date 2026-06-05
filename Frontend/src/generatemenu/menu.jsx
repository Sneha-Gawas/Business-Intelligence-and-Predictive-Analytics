import React, { useState ,useEffect} from "react";
import axios from "axios";
import "./menu.css";
const coffeeItems = {
  "Espresso": "Espresso.jpg",
  "Red Eye": "Red_Eye.jpg",
  "Black Eye": "Black_eye.jpg",
  "Americano": "Americano.jpg",
  "Long Black": "Long_Black_Coffee.jpg",
  "Macchiato": "Macchiato.jpg",
  "Long Macchiato": "Long_Macchiato.jpg",
  "Cortado": "Cortado.jpg",
  "Breve": "Breve.jpg",
  "Cappuccino": "Cappuccino.jpg",
  "Flat White": "Flat_White.jpg",
  "Cafe Latte": "Cafe_Latte.jpg",
  "Iced Mocha": "Iced_Mocha.jpg",
  "Vienna": "Vienna.jpg",
  "Affogato": "Affogato.jpg",
  "Iced Coffee": "Iced_Coffee.jpg",
  "Hot Velvet Coffee": "Hot_Velvet_Coffee.jpg",
  "Lemon Green Coffee": "Lemon_Green_Coffee.jpg",
  "Filter Coffee": "Filter_Coffee.jpg",
  "Vanilla Latte": "Vanilla_Latte.jpg",
  "Vanilla Cappuccino": "Vanilla_Cappuccino.jpg",
  "Turmeric Ginger Cappuccino": "Turmeric_Ginger_Cappuccino.jpg",
  "Iced Cappuccino": "Iced_Cappuccino.jpg",
  "Iced Latte": "Iced_Latte.jpg"
};
const RecommendationForm = () => {
  const [recommendations, setRecommendations] = useState([]);


  const fetchRecommendations = async () => {
    try {
      const response = await axios.post("http://localhost:8080/recommend");
      setRecommendations(response.data.recommended_coffees);
       // Ensure sessionIndex is in sync with Flask
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  
const downloadPDF = async () => {
  try {
    const response = await axios.get("http://localhost:8080/download_pdf", {
      responseType: "blob", // Ensure response is binary
    });

    if (!response.data) {
      throw new Error("PDF response is empty.");
    }

    const pdfBlob = new Blob([response.data], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Create and trigger a hidden anchor tag
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", "filtered_recommendations.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error("Error downloading PDF:", error.message || error);
  }
};

useEffect(()=>{
  fetchRecommendations()
},[]);


  return (
    <div style={{marginTop:"20px"}} className="main">
      <h2>Recommended Coffee Products</h2>
      <div className="button-container">
      {/* <button className="reccomend" onClick={fetchRecommendations}><b style={{fontSize:"25px"}}>Get Recommendations</b></button> */}
      <button className="download" onClick={downloadPDF} >
        <b style={{fontSize:"25px"}}>Download Menu Card PDF</b>
      </button>
      </div>
      <div className="coffee-grid">
        {recommendations.map((coffee, index) => (
          <div key={index} className="coffee-item">
            <img src={`/images/${coffeeItems[coffee]}`} alt={coffee} />
            <h3>{coffee}</h3>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default RecommendationForm;
