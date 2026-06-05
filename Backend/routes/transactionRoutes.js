// routes/transactions.js
import express from 'express'
import Transaction from '../models/transaction.js'
import cors from 'cors'
const router = express.Router();
router.use(cors());
// Create a new transaction
router.post('/', async (req, res) => {
  try {
    const { TransactionID,Items,TotalCost,UserID } = req.body;
    const transaction = new Transaction({ TransactionID,Items,TotalCost,UserID });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a transaction by transactionId
router.put('/:TransactionID', async (req, res) => {
  try {
    const { TransactionID } = req.params;
    const { Items, TotalCost,UserID } = req.body;
    const transaction = await Transaction.findOneAndUpdate(
      { TransactionID },
      { Items,TotalCost,UserID },
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a transaction by transactionId
router.delete('/:TransactionID', async (req, res) => {
  try {
    const { TransactionID } = req.params;
    const transaction = await Transaction.findOneAndDelete({ TransactionID });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search transactions by transactionId
router.get('/search/:TransactionID', async (req, res) => {
  try {
    const { TransactionID } = req.params;
    const transaction = await Transaction.findOne({ TransactionID });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

