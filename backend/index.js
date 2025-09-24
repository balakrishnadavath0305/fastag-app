const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// --- Get FASTag balance ---
app.get('/api/fastag/balance/:fastag_id', (req, res) => {
  const { fastag_id } = req.params;
  pool.query('SELECT balance FROM fastag WHERE fastag_id = ?', [fastag_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'FASTag not found' });
    res.json({ balance: results[0].balance });
  });
});

// --- Get transactions ---
app.get('/api/fastag/transactions/:fastag_id', (req, res) => {
  const { fastag_id } = req.params;
  pool.query('SELECT * FROM transactions WHERE fastag_id = ? ORDER BY txn_time DESC', [fastag_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --- Recharge FASTag ---
app.post('/api/fastag/recharge', (req, res) => {
  const { fastag_id, amount, mode } = req.body;
  pool.query('UPDATE fastag SET balance = balance + ? WHERE fastag_id = ?', [amount, fastag_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    pool.query('INSERT INTO transactions (fastag_id,type,amount,balance_after) VALUES (?, ?, ?, (SELECT balance FROM fastag WHERE fastag_id = ?))',
      [fastag_id, 'Recharge', amount, fastag_id], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: 'Recharge successful' });
      });
  });
});

// --- Toll passage deduction ---
app.post('/api/fastag/passage', (req, res) => {
  const { fastag_id, plaza_id } = req.body;
  pool.query('SELECT toll_rate FROM toll_plaza WHERE plaza_id = ?', [plaza_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Plaza not found' });
    const toll = results[0].toll_rate;
    pool.query('UPDATE fastag SET balance = balance - ? WHERE fastag_id = ?', [toll, fastag_id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      pool.query('INSERT INTO transactions (fastag_id,type,amount,balance_after) VALUES (?, ?, ?, (SELECT balance FROM fastag WHERE fastag_id = ?))',
        [fastag_id, 'Toll Deduction', toll, fastag_id], (err3) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json({ message: 'Passage recorded and balance updated' });
        });
    });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
