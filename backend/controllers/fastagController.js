const pool = require('..');

exports.rechargeFastag = async (req, res) => {
  const { fastag_id, amount, mode } = req.body;

  try {
    const conn = await pool.getConnection();
    await conn.query('CALL add_recharge(?, ?, ?)', [fastag_id, amount, mode]);
    conn.release();

    res.json({ success: true, message: 'Recharge successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.insertPassage = async (req, res) => {
  const { fastag_id, vehicle_id, plaza_id } = req.body;

  try {
    const conn = await pool.getConnection();
    await conn.query('CALL insert_passage(?, ?, ?)', [fastag_id, vehicle_id, plaza_id]);
    conn.release();

    res.json({ success: true, message: 'Passage recorded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getBalance = async (req, res) => {
  const { fastag_id } = req.params;
  try {
    const [rows] = await pool.query('SELECT balance FROM FASTags WHERE fastag_id = ?', [fastag_id]);
    res.json({ balance: rows[0].balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
