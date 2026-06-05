import React, { useState } from 'react';
import axios from 'axios';
import './sentimentForm.css';

const SentimentForm = () => {
  const [userId, setUserId] = useState('');
  const [product, setProduct] = useState('');
  const [review, setReview] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const products = [
    "Espresso", "Red Eye", "Black Eye", "Americano", "Long Black", "Macchiato", "Long Macchiato", "Cortado", "Breve", "Cappuccino",
    "Flat White", "Cafe Latte", "Iced Mocha", "Vienna", "Affogato", "Iced Coffee", "Hot Velvet Coffee", "Lemon Green Coffee", "Filter Coffee",
    "Vanilla Latte", "Vanilla Cappuccino", "Turmeric Ginger Cappuccino", "Gourmet Belgian Hot Chocolate", "Iced Cappuccino", "Iced Latte",
    "Mango Frappe", "Crunchy Frappe", "Dark Frappe", "Gourmet Belgian Cold Chocolate", "Hazelnut Brownie Cake Shake", "Red Velvet Cake Shake",
    "Lemon Cake Shake", "Cheesecake Shake", "Chocolate Fantasy Cake Shake", "Tropical Iceberg", "Vegan Shake", "Watermelon Mojito", "Peach Iced Tea",
    "Classic Lemonade", "Watermelon Granita", "Iced Tea Latte", "Elaichi Tea", "Ginger Tea", "Masala Tea", "Hot Tea Latte", "Green Tea", "Herbal Tea",
    "Earl Grey Orange Tea", "Croissant", "Muffin", "Bagel", "Danish", "Scone", "Brioche", "Baguette", "Cocoa Fantasy Pastry", "Pineapple Delight Pastry",
    "Crackling Brownie Pastry", "Flavoured Ice Cream", "Donut", "Cookie", "Brownie", "Macaron", "Granola Bar", "Cutlet", "Popcorn", "Sandwich",
    "Panini", "Pasta", "Pizza", "Salad", "Soup", "Quiche", "Burrito", "Tacos", "Cake", "Pudding", "Eclair", "Cupcake", "Mousse"
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const parsedUserId = parseInt(userId, 10);
    try {
      // Send request to Express (which forwards it to Flask)
      const response = await axios.post('http://localhost:8080/sentiment', {
        user_id: parsedUserId,
        product: product,
        review: review,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setSentiment(response.data.result);
    } catch (error) {
      setError('Failed to analyze sentiment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sentiment-container">
      <h2>Sentiment Analysis</h2>
      <form className='s' onSubmit={handleSubmit}>
        <div>
          <label>User ID:</label>
          <input 
            type="text" 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Product:</label>
          <select 
            value={product} 
            onChange={(e) => setProduct(e.target.value)} 
            required
          >
            <option value="">Select a Product</option>
            {products.map((prod, index) => (
              <option key={index} value={prod}>{prod}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Review:</label>
          <textarea 
            value={review} 
            onChange={(e) => setReview(e.target.value)} 
            rows="4" 
            required
          />
        </div>
        <button type="submit" disabled={loading}>Analyze Sentiment</button>
      </form>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {sentiment && <p className="sentiment-result">{sentiment}</p>}
    </div>
  );
};

export default SentimentForm;
