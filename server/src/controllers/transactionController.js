const pool = require("../config/db");

const getTransactions = async (req, res) => {
  try {
    const transactions = await pool.query(
      `SELECT 
        transactions.id,
        transactions.user_id,
        transactions.category_id,
        transactions.type,
        transactions.amount,
        transactions.note,
        transactions.transaction_date,
        transactions.created_at,
        categories.name AS category_name
       FROM transactions
       LEFT JOIN categories ON transactions.category_id = categories.id
       WHERE transactions.user_id = $1
       ORDER BY transactions.transaction_date DESC, transactions.created_at DESC`,
      [req.user.id]
    );

    res.json({
      transactions: transactions.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { category_id, type, amount, note, transaction_date } = req.body;

    if (!type || !amount || !transaction_date) {
      return res.status(400).json({
        message: "Please provide type, amount, and transaction_date",
      });
    }

    if (type !== "income" && type !== "expense") {
      return res.status(400).json({
        message: "Type must be income or expense",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    if (category_id) {
      const categoryResult = await pool.query(
        "SELECT * FROM categories WHERE id = $1 AND user_id = $2",
        [category_id, req.user.id]
      );

      if (categoryResult.rows.length === 0) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      if (categoryResult.rows[0].type !== type) {
        return res.status(400).json({
          message: "Category type must match transaction type",
        });
      }
    }

    const newTransaction = await pool.query(
      `INSERT INTO transactions 
       (user_id, category_id, type, amount, note, transaction_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        req.user.id,
        category_id || null,
        type,
        amount,
        note || null,
        transaction_date,
      ]
    );

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: newTransaction.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, type, amount, note, transaction_date } = req.body;

    if (!type || !amount || !transaction_date) {
      return res.status(400).json({
        message: "Please provide type, amount, and transaction_date",
      });
    }

    if (type !== "income" && type !== "expense") {
      return res.status(400).json({
        message: "Type must be income or expense",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const existingTransaction = await pool.query(
      "SELECT * FROM transactions WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    if (existingTransaction.rows.length === 0) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    if (category_id) {
      const categoryResult = await pool.query(
        "SELECT * FROM categories WHERE id = $1 AND user_id = $2",
        [category_id, req.user.id]
      );

      if (categoryResult.rows.length === 0) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      if (categoryResult.rows[0].type !== type) {
        return res.status(400).json({
          message: "Category type must match transaction type",
        });
      }
    }

    const updatedTransaction = await pool.query(
      `UPDATE transactions
       SET category_id = $1,
           type = $2,
           amount = $3,
           note = $4,
           transaction_date = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [
        category_id || null,
        type,
        amount,
        note || null,
        transaction_date,
        id,
        req.user.id,
      ]
    );

    res.json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTransaction = await pool.query(
      "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (deletedTransaction.rows.length === 0) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.json({
      message: "Transaction deleted successfully",
      transaction: deletedTransaction.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};