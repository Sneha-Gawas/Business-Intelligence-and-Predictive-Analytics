import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./t.css";

function TransactionForm() {
  const [transactions, setTransactions] = useState([]);
  const [activeForm, setActiveForm] = useState(''); // Tracks active form: "add" or "update"

  // Separate states for Add and Update forms
  const [addForm, setAddForm] = useState({
    TransactionID: '',
    Items: '',
    TotalCost: '',
    UserID: '',
  });

  const [updateForm, setUpdateForm] = useState({
    TransactionID: '',
    Items: '',
    TotalCost: '',
    UserID: '',
  });

  const [deleteId, setDeleteId] = useState('');
  const [searchId, setSearchId] = useState('');

  // Fetch transactions
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/transactions')
      .then((response) => setTransactions(response.data))
      .catch((err) => console.error(err));
  }, []);

  // Add a transaction
  const addTransaction = async (e) => {
    e.preventDefault();
    const { TransactionID, Items, TotalCost, UserID } = addForm;
    if (!TransactionID || !Items || !TotalCost || !UserID) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/transactions', addForm);
      setTransactions([...transactions, response.data]);
      setAddForm({ TransactionID: '', Items: '', TotalCost: '', UserID: '' }); // Clear Add form
    } catch (err) {
      console.error(err);
    }
  };

  // Update a transaction
  const updateTransaction = async (e) => {
    e.preventDefault();
    const { TransactionID, Items, TotalCost, UserID } = updateForm;
    if (!TransactionID) {
      alert("Transaction ID is required for update.");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/api/transactions/${TransactionID}`, {
        Items,
        TotalCost,
        UserID,
      });
      setTransactions(
        transactions.map((transaction) =>
          transaction.TransactionID === TransactionID ? response.data : transaction
        )
      );
      setUpdateForm({ TransactionID: '', Items: '', TotalCost: '', UserID: '' }); // Clear Update form
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a transaction by ID
  const deleteTransaction = async () => {
    if (!deleteId) {
      alert("Please provide a Transaction ID for deletion.");
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/transactions/${deleteId}`);
      setTransactions(transactions.filter((transaction) => transaction.TransactionID !== deleteId));
      setDeleteId('');
    } catch (err) {
      console.error(err);
    }
  };

  // Search by Transaction ID
  const searchTransaction = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/transactions/search/${searchId}`);
      setTransactions([response.data]);
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
      setUpdateForm({ TransactionID: '', Items: '', TotalCost: '', UserID: '' });
    } else if (form === 'update') {
      setAddForm({ TransactionID: '', Items: '', TotalCost: '', UserID: '' });
    }
  };

  return (
    <div className='transactions'>
      <h1>Transactions</h1>

      {/* Search Bar */}
      <div className="search-delete-container">
      <div className="search">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Search by Transaction ID"
        />
        <button onClick={searchTransaction}>Search</button>
      </div>
      <br />

      {/* Delete Bar */}
      <div className="delete">
        <input
          type="text"
          value={deleteId}
          onChange={(e) => setDeleteId(e.target.value)}
          placeholder="Delete by Transaction ID"
        />
        <button onClick={deleteTransaction}>Delete</button>
      </div>
      </div>
      

      {/* Add Transaction Form */}
      <div className="form-container">
      <form className='Add' onSubmit={addTransaction}>
        <h3>Add Transaction</h3>
        <input
          type="number"
          value={addForm.TransactionID}
          onChange={(e) => handleInputChange('add', 'TransactionID', e.target.value)}
          placeholder="Transaction ID"
          onFocus={() => handleFormSwitch('add')}
        />
        <input
          type="text"
          value={addForm.Items}
          onChange={(e) => handleInputChange('add', 'Items', e.target.value)}
          placeholder="Items"
        />
        <input
          type="number"
          value={addForm.TotalCost}
          onChange={(e) => handleInputChange('add', 'TotalCost', e.target.value)}
          placeholder="Total Cost"
        />
        <input
          type="number"
          value={addForm.UserID}
          onChange={(e) => handleInputChange('add', 'UserID', e.target.value)}
          placeholder="User ID"
        />
        <button type="submit" disabled={activeForm !== 'add'}>
          Add Transaction
        </button>
      </form>

      {/* Update Transaction Form */}
      <form className='Update' onSubmit={updateTransaction}>
        <h3>Update Transaction</h3>
        <input
          type="number"
          value={updateForm.TransactionID}
          onChange={(e) => handleInputChange('update', 'TransactionID', e.target.value)}
          placeholder="Transaction ID to Update"
          onFocus={() => handleFormSwitch('update')}
        />
        <input
          type="text"
          value={updateForm.Items}
          onChange={(e) => handleInputChange('update', 'Items', e.target.value)}
          placeholder="Items"
        />
        <input
          type="number"
          value={updateForm.TotalCost}
          onChange={(e) => handleInputChange('update', 'TotalCost', e.target.value)}
          placeholder="Total Cost"
        />
        <input
          type="number"
          value={updateForm.UserID}
          onChange={(e) => handleInputChange('update', 'UserID', e.target.value)}
          placeholder="User ID"
        />
        <button type="submit" disabled={activeForm !== 'update'}>
          Update Transaction
        </button>
      </form>
      </div>

      {/* Display Transactions */}
      <table border="1">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Items</th>
            <th>Total Cost</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.TransactionID}>
              <td>{transaction.TransactionID}</td>
              <td>{transaction.Items}</td>
              <td>{transaction.TotalCost}</td>
              <td>{transaction.UserID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionForm;
