const pool = require("../config/db");

const getDashboardSummary = async (req, res) => {
  try {
    const { month } = req.query;

    let dateFilter = "";
    const params = [req.user.id];

    if (month) {
      dateFilter = `
        AND transaction_date >= $2
        AND transaction_date < ($2::date + INTERVAL '1 month')
      `;

      params.push(`${month}-01`);
    }

    const totalIncomeResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_income
       FROM transactions
       WHERE user_id = $1 AND type = 'income'
       ${dateFilter}`,
      params
    );

    const totalExpensesResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_expenses
       FROM transactions
       WHERE user_id = $1 AND type = 'expense'
       ${dateFilter}`,
      params
    );

    const expensesByCategoryResult = await pool.query(
      `SELECT 
        categories.name AS category_name,
        COALESCE(SUM(transactions.amount), 0) AS total
       FROM transactions
       LEFT JOIN categories ON transactions.category_id = categories.id
       WHERE transactions.user_id = $1 
       AND transactions.type = 'expense'
       ${dateFilter}
       GROUP BY categories.name
       ORDER BY total DESC`,
      params
    );

    const incomeByCategoryResult = await pool.query(
      `SELECT 
        categories.name AS category_name,
        COALESCE(SUM(transactions.amount), 0) AS total
       FROM transactions
       LEFT JOIN categories ON transactions.category_id = categories.id
       WHERE transactions.user_id = $1 
       AND transactions.type = 'income'
       ${dateFilter}
       GROUP BY categories.name
       ORDER BY total DESC`,
      params
    );

    const recentTransactionsResult = await pool.query(
      `SELECT 
        transactions.id,
        transactions.type,
        transactions.amount,
        transactions.note,
        transactions.transaction_date,
        categories.name AS category_name
       FROM transactions
       LEFT JOIN categories ON transactions.category_id = categories.id
       WHERE transactions.user_id = $1
       ${dateFilter}
       ORDER BY transactions.transaction_date DESC, transactions.created_at DESC
       LIMIT 5`,
      params
    );

    const totalIncome = Number(totalIncomeResult.rows[0].total_income);
    const totalExpenses = Number(totalExpensesResult.rows[0].total_expenses);
    const balance = totalIncome - totalExpenses;

    res.json({
      selectedMonth: month || "all",
      totalIncome,
      totalExpenses,
      balance,
      expensesByCategory: expensesByCategoryResult.rows,
      incomeByCategory: incomeByCategoryResult.rows,
      recentTransactions: recentTransactionsResult.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getDashboardSummary,
};