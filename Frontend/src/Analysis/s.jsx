import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const SentimentAnalysis = () => {
  const [sentimentData, setSentimentData] = useState({});

  useEffect(() => {
    fetch("http://localhost:8080/sentiment-data")
      .then((res) => res.json())
      .then((data) => setSentimentData(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // Define soft colors for a more appealing look
  const colorMapping = {
    Positive: "rgba(0, 200, 83, 0.7)", // Soft Green
    Negative: "rgba(255, 82, 82, 0.7)", // Soft Red
    Neutral: "rgba(158, 158, 158, 0.7)", // Soft Gray
  };

  return (
    <>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>PRODUCT PERFORMANCE</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          padding: "20px",
          justifyContent: "center",
        }}
      >
        {Object.entries(sentimentData).map(([product, sentiments]) => {
          const filteredSentiments = Object.entries(sentiments).filter(([_, value]) => value > 0);
          const total = filteredSentiments.reduce((sum, [, value]) => sum + value, 0);

          return (
            <div
              key={product}
              style={{
                width: "320px",
                textAlign: "center",
                background: "#fff",
                padding: "15px",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease-in-out",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>{product}</h3>
              <Pie
                data={{
                  labels: filteredSentiments.map(([label]) => label),
                  datasets: [
                    {
                      data: filteredSentiments.map(([_, value]) => value),
                      backgroundColor: filteredSentiments.map(([label]) => colorMapping[label]),
                      borderColor: "white",
                      borderWidth: 2,
                      hoverOffset: 8,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { position: "bottom", labels: { font: { size: 14 } } },
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => {
                          const value = tooltipItem.raw;
                          const percentage = ((value / total) * 100).toFixed(2);
                          return `${tooltipItem.label}: ${percentage}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SentimentAnalysis;