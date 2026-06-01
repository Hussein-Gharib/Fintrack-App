import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import AppLayout from "../components/AppLayout";
import api from "../api/axios";
import { formatMoney, getCurrency } from "../utils/currency";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
];

function Dashboard() {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [currency, setCurrencyState] = useState(getCurrency());

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    expensesByCategory: [],
    incomeByCategory: [],
    recentTransactions: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startingBalance, setStartingBalance] = useState("");
  const [savingBalance, setSavingBalance] = useState(false);

  useEffect(() => {
    const handleCurrencyChanged = () => {
      setCurrencyState(getCurrency());
    };

    window.addEventListener("currencyChanged", handleCurrencyChanged);

    return () => {
      window.removeEventListener("currencyChanged", handleCurrencyChanged);
    };
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        `/dashboard/summary?month=${selectedMonth}`
      );
      setSummary(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [selectedMonth]);

  const handleStartingBalanceSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!startingBalance || Number(startingBalance) <= 0) {
      setError("Please enter a valid starting balance");
      return;
    }

    setSavingBalance(true);

    try {
      await api.post("/transactions", {
        category_id: null,
        type: "income",
        amount: Number(startingBalance),
        note: "Starting balance",
        transaction_date: new Date().toISOString().slice(0, 10),
      });

      setStartingBalance("");
      await fetchSummary();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save starting balance");
    } finally {
      setSavingBalance(false);
    }
  };

  const expenseChartData = summary.expensesByCategory.map((item) => ({
    name: item.category_name || "Uncategorized",
    value: Number(item.total),
  }));

  const incomeChartData = summary.incomeByCategory.map((item) => ({
    name: item.category_name || "Uncategorized",
    value: Number(item.total),
  }));

  const shouldShowStartingBalance =
    summary.recentTransactions.length === 0 &&
    Number(summary.totalIncome) === 0 &&
    Number(summary.totalExpenses) === 0;

  return (
    <AppLayout
      title="Dashboard"
      subtitle="Your financial snapshot for the selected month."
    >
      <div className="dashboard-toolbar">
        <div>
          <h3>Monthly overview</h3>
          <p>Filter your income, expenses, and charts by month.</p>
        </div>

        <div className="month-picker">
          <label>Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      {loading && <div className="panel-card">Loading dashboard...</div>}

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <>
          {shouldShowStartingBalance && (
            <div className="panel-card starting-balance-card">
              <div>
                <span className="preview-badge">First step</span>
                <h2>Set your starting balance</h2>
                <p>
                  Add the money you currently have so FinTrack can calculate
                  your real balance from the beginning.
                </p>
              </div>

              <form
                className="starting-balance-form"
                onSubmit={handleStartingBalanceSubmit}
              >
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={startingBalance}
                  onChange={(e) => setStartingBalance(e.target.value)}
                />

                <button className="btn btn-primary" type="submit">
                  {savingBalance ? "Saving..." : "Save balance"}
                </button>
              </form>
            </div>
          )}

          <div className="page-grid">
            <div className="stat-card highlight">
              <span>Total Balance</span>
              <h2>{formatMoney(summary.balance, currency)}</h2>
              <p>Income minus expenses</p>
            </div>

            <div className="stat-card">
              <span>Total Income</span>
              <h2>{formatMoney(summary.totalIncome, currency)}</h2>
              <p>Money earned</p>
            </div>

            <div className="stat-card">
              <span>Total Expenses</span>
              <h2>{formatMoney(summary.totalExpenses, currency)}</h2>
              <p>Money spent</p>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="panel-card chart-card">
              <div className="section-heading">
                <div>
                  <h2>Expenses breakdown</h2>
                  <p>Visual spending by category.</p>
                </div>
              </div>

              {expenseChartData.length === 0 ? (
                <div className="empty-state">
                  No expense data yet for this month.
                </div>
              ) : (
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={expenseChartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={70}
                        outerRadius={105}
                        paddingAngle={4}
                      >
                        {expenseChartData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatMoney(value, currency)}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="chart-legend">
                    {expenseChartData.map((item, index) => (
                      <div className="legend-row" key={item.name}>
                        <span
                          className="legend-dot"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <strong>{item.name}</strong>
                        <small>{formatMoney(item.value, currency)}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="panel-card chart-card">
              <div className="section-heading">
                <div>
                  <h2>Expense category totals</h2>
                  <p>Compare expenses quickly.</p>
                </div>
              </div>

              {expenseChartData.length === 0 ? (
                <div className="empty-state">
                  No expense totals for this month.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={expenseChartData}>
                    <defs>
                      <linearGradient
                        id="expenseBarGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fill: "#64748b",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fill: "#64748b",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                    />

                    <Tooltip
                      formatter={(value) => formatMoney(value, currency)}
                    />

                    <Bar
                      dataKey="value"
                      fill="url(#expenseBarGradient)"
                      radius={[14, 14, 0, 0]}
                      barSize={70}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="panel-card chart-card">
              <div className="section-heading">
                <div>
                  <h2>Income breakdown</h2>
                  <p>Visual income by category.</p>
                </div>
              </div>

              {incomeChartData.length === 0 ? (
                <div className="empty-state">
                  No income data yet for this month.
                </div>
              ) : (
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={incomeChartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={70}
                        outerRadius={105}
                        paddingAngle={4}
                      >
                        {incomeChartData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatMoney(value, currency)}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="chart-legend">
                    {incomeChartData.map((item, index) => (
                      <div className="legend-row" key={item.name}>
                        <span
                          className="legend-dot"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <strong>{item.name}</strong>
                        <small>{formatMoney(item.value, currency)}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="panel-card chart-card">
              <div className="section-heading">
                <div>
                  <h2>Income category totals</h2>
                  <p>Compare income sources quickly.</p>
                </div>
              </div>

              {incomeChartData.length === 0 ? (
                <div className="empty-state">
                  No income totals for this month.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={incomeChartData}>
                    <defs>
                      <linearGradient
                        id="incomeBarGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#16a34a" />
                        <stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fill: "#64748b",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fill: "#64748b",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                    />

                    <Tooltip
                      formatter={(value) => formatMoney(value, currency)}
                    />

                    <Bar
                      dataKey="value"
                      fill="url(#incomeBarGradient)"
                      radius={[14, 14, 0, 0]}
                      barSize={70}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="panel-card">
            <div className="section-heading">
              <div>
                <h2>Recent transactions</h2>
                <p>Your latest money activity for this month.</p>
              </div>
            </div>

            {summary.recentTransactions.length === 0 ? (
              <div className="empty-state">
                No transactions found for this month.
              </div>
            ) : (
              <div className="transaction-mini-list">
                {summary.recentTransactions.map((transaction) => (
                  <div className="transaction-mini-row" key={transaction.id}>
                    <div>
                      <strong>{transaction.note || "No note"}</strong>
                      <span>
                        {transaction.category_name || "Uncategorized"} ·{" "}
                        {new Date(
                          transaction.transaction_date
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <strong
                      className={
                        transaction.type === "income"
                          ? "amount-income"
                          : "amount-expense"
                      }
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatMoney(transaction.amount, currency)}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </AppLayout>
  );
}

export default Dashboard;