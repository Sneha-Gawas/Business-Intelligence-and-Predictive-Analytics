import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./r.css";

function ReviewForm() {
  const [reviews, setReviews] = useState([]);
  const [activeForm, setActiveForm] = useState(''); // Tracks active form: "add" or "update"

  // Separate states for Add and Update forms
  const [addForm, setAddForm] = useState({
    UserID: '',
    Product: '',
    Review: '',
    Sentiment: '',
    Ratings: '',
  });

  const [updateForm, setUpdateForm] = useState({
    UserID: '',
    Product: '',
    Review: '',
    Sentiment: '',
    Ratings: '',
  });

  const [deleteId, setDeleteId] = useState('');
  const [searchId, setSearchId] = useState('');

  // Fetch reviews
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/reviews')
      .then((response) => setReviews(response.data))
      .catch((err) => console.error(err));
  }, []);

  // Add a review
  const addReview = async (e) => {
    e.preventDefault();
    const { UserID, Product, Review, Sentiment, Ratings } = addForm;
    if (!UserID || !Product || !Review || !Sentiment || !Ratings) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/reviews', addForm);
      setReviews([...reviews, response.data]);
      setAddForm({ UserID: '', Product: '', Review: '', Sentiment: '', Ratings: '' }); // Clear Add form
    } catch (err) {
      console.error(err);
    }
  };

  // Update a review
  const updateReview = async (e) => {
    e.preventDefault();
    const { UserID, Product, Review, Sentiment, Ratings } = updateForm;
    if (!UserID) {
      alert("UserID is required for update.");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/api/reviews/${UserID}`, {
        Product,
        Review,
        Sentiment,
        Ratings,
      });
      setReviews(
        reviews.map((review) =>
          review.UserID === UserID ? response.data : review
        )
      );
      setUpdateForm({ UserID: '', Product: '', Review: '', Sentiment: '', Ratings: '' }); // Clear Update form
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a review by UserID
  const deleteReview = async () => {
    if (!deleteId) {
      alert("Please provide a UserID for deletion.");
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${deleteId}`);
      setReviews(reviews.filter((review) => review.UserID !== deleteId));
      setDeleteId('');
    } catch (err) {
      console.error(err);
    }
  };

  // Search by UserID
  const searchReview = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/reviews/search/${searchId}`);
      setReviews([response.data]);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle input changes for Add and Update forms
  const handleInputChange = (form, field, value) => {
    if (form === 'add') {
      setAddForm({ ...addForm, [field]: value });
    } else if (form === 'update') {
      setUpdateForm({ ...updateForm, [field]: value });
    }
  };

  // Clear fields on form switch
  const handleFormSwitch = (form) => {
    setActiveForm(form);
    if (form === 'add') {
      setUpdateForm({ UserID: '', Product: '', Review: '', Sentiment: '', Ratings: '' });
    } else if (form === 'update') {
      setAddForm({ UserID: '', Product: '', Review: '', Sentiment: '', Ratings: '' });
    }
  };

  return (
    <div className='Reviews'>
      <h1>Reviews</h1>

      {/* Search Bar */}
      <div className='search-delete-container'>
      <div className="search">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Search by UserID"
        />
        <button onClick={searchReview}>Search</button>
      </div>
      <br />

      {/* Delete Bar */}
      <div className="delete">
        <input
          type="text"
          value={deleteId}
          onChange={(e) => setDeleteId(e.target.value)}
          placeholder="Delete by UserID"
        />
        <button onClick={deleteReview}>Delete</button>
      </div>
      </div>
     
<div className='form-container'>
      {/* Add Review Form */}
      <form className='AddForm'onSubmit={addReview}>
        <h3>Add Review</h3>
        <input
          type="text"
          value={addForm.UserID}
          onChange={(e) => handleInputChange('add', 'UserID', e.target.value)}
          placeholder="User ID"
          onFocus={() => handleFormSwitch('add')}
        />
        <input
          type="text"
          value={addForm.Product}
          onChange={(e) => handleInputChange('add', 'Product', e.target.value)}
          placeholder="Product"
        />
        <textarea
          value={addForm.Review}
          onChange={(e) => handleInputChange('add', 'Review', e.target.value)}
          placeholder="Review"
        />
        <input
          type="text"
          value={addForm.Sentiment}
          onChange={(e) => handleInputChange('add', 'Sentiment', e.target.value)}
          placeholder="Sentiment (e.g., Positive/Negative)"
        />
        <input
          type="number"
          value={addForm.Ratings}
          onChange={(e) => handleInputChange('add', 'Ratings', e.target.value)}
          placeholder="Ratings (1-5)"
        />
        <button type="submit" disabled={activeForm !== 'add'}>
          Add Review
        </button>
      </form>

      {/* Update Review Form */}
      <form className='updateform' onSubmit={updateReview}>
        <h3>Update Review</h3>
        <input
          type="text"
          value={updateForm.UserID}
          onChange={(e) => handleInputChange('update', 'UserID', e.target.value)}
          placeholder="User ID to Update"
          onFocus={() => handleFormSwitch('update')}
        />
        <input
          type="text"
          value={updateForm.Product}
          onChange={(e) => handleInputChange('update', 'Product', e.target.value)}
          placeholder="Product"
        />
        <textarea
          value={updateForm.Review}
          onChange={(e) => handleInputChange('update', 'Review', e.target.value)}
          placeholder="Review"
        />
        <input
          type="text"
          value={updateForm.Sentiment}
          onChange={(e) => handleInputChange('update', 'Sentiment', e.target.value)}
          placeholder="Sentiment (e.g., Positive/Negative)"
        />
        <input
          type="number"
          value={updateForm.Ratings}
          onChange={(e) => handleInputChange('update', 'Ratings', e.target.value)}
          placeholder="Ratings (1-5)"
        />
        <button type="submit" disabled={activeForm !== 'update'}>
          Update Review
        </button>
      </form>
</div>
      {/* Display Reviews */}
      <table border="1">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Product</th>
            <th>Review</th>
            <th>Sentiment</th>
            <th>Ratings</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.UserID}>
              <td>{review.UserID}</td>
              <td>{review.Product}</td>
              <td>{review.Review}</td>
              <td>{review.Sentiment}</td>
              <td>{review.Ratings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewForm;
