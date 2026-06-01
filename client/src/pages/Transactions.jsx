import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";
import api from "../api/axios";
import { formatMoney, getCurrency } from "../utils/currency";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    category_id: "",
    type: "expense",
    amount: "",
    note: "",
    transaction_date: new Date().toISOString().slice(0, 10),
  });

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category_id: "all",
    sort: "newest",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [currency, setCurrencyState] = useState(getCurrency());

  useEffect(() => {
    const handleCurrencyChanged = () => {
      setCurrencyState(getCurrency());
    };

    window.addEventListener("currencyChanged", handleCurrencyChanged);

    return () => {
      window.removeEventListener("currencyChanged", handleCurrencyChanged);
    };
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");
      setTransactions(response.data.transactions);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.categories);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load categories");
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const formCategories = categories.filter(
    (category) => category.type === formData.type
  );

  const filteredTransactions = useMemo(() => {
    const searchTerm = filters.search.toLowerCase().trim();

    return [...transactions]
      .filter((transaction) => {
        const matchesSearch =
          !searchTerm ||
          transaction.note?.toLowerCase().includes(searchTerm) ||
          transaction.category_name?.toLowerCase().includes(searchTerm) ||
          transaction.type?.toLowerCase().includes(searchTerm);

        const matchesType =
          filters.type === "all" || transaction.type === filters.type;

        const matchesCategory =
          filters.category_id === "all" ||
          String(transaction.category_id || "") === filters.category_id;

        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((a, b) => {
        const dateA = new Date(a.transaction_date).getTime();
        const dateB = new Date(b.transaction_date).getTime();

        if (filters.sort === "oldest") return dateA - dateB;
        if (filters.sort === "highest") {
          return Number(b.amount) - Number(a.amount);
        }
        if (filters.sort === "lowest") {
          return Number(a.amount) - Number(b.amount);
        }

        return dateB - dateA;
      });
  }, [transactions, filters]);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      category_id: "",
      type: "expense",
      amount: "",
      note: "",
      transaction_date: new Date().toISOString().slice(0, 10),
    });
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      type: "all",
      category_id: "all",
      sort: "newest",
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      ...(e.target.name === "type" ? { category_id: "" } : {}),
    }));
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);

    setFormData({
      category_id: transaction.category_id || "",
      type: transaction.type,
      amount: transaction.amount,
      note: transaction.note || "",
      transaction_date: transaction.transaction_date.slice(0, 10),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        ...formData,
        category_id: formData.category_id || null,
        amount: Number(formData.amount),
      };

      if (editingId) {
        await api.put(`/transactions/${editingId}`, payload);
      } else {
        await api.post("/transactions", payload);
      }

      resetForm();
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save transaction");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this transaction?");

    if (!confirmed) return;

    try {
      await api.delete(`/transactions/${id}`);

      if (editingId === id) {
        resetForm();
      }

      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete transaction");
    }
  };

  return (
    <AppLayout
      title="Transactions"
      subtitle="Add, edit, search, and manage your income and expenses."
    >
      {error && <div className="alert alert-error">{error}</div>}

      <div className="two-column-grid">
        <div className="panel-card">
          <div className="section-heading">
            <div>
              <h2>{editingId ? "Edit transaction" : "Add transaction"}</h2>
              <p>
                {editingId
                  ? "Update your selected transaction."
                  : "Record income or expenses in seconds."}
              </p>
            </div>
          </div>

          <form className="app-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
              >
                <option value="">No category</option>
                {formCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                placeholder="25.50"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Note</label>
              <input
                type="text"
                name="note"
                placeholder="Lunch, salary, rent..."
                value={formData.note}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="transaction_date"
                value={formData.transaction_date}
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-primary" type="submit">
              {saving
                ? "Saving..."
                : editingId
                ? "Update transaction"
                : "Add transaction"}
            </button>

            {editingId && (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            )}
          </form>
        </div>

        <div className="panel-card">
          <div className="section-heading">
            <div>
              <h2>Your transactions</h2>
              <p>
                Showing {filteredTransactions.length} of {transactions.length}{" "}
                transactions.
              </p>
            </div>
          </div>

          <div className="transaction-filters">
            <div className="form-group">
              <label>Search</label>
              <input
                type="text"
                name="search"
                placeholder="Search note, category, type..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-row">
              <div className="form-group">
                <label>Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="all">All</option>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category_id"
                  value={filters.category_id}
                  onChange={handleFilterChange}
                >
                  <option value="all">All categories</option>
                  <option value="">Uncategorized</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Sort</label>
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest amount</option>
                  <option value="lowest">Lowest amount</option>
                </select>
              </div>
            </div>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={resetFilters}
            >
              Clear filters
            </button>
          </div>

          {loading ? (
            <div className="empty-state">Loading transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="empty-state">No transactions match your filters.</div>
          ) : (
            <div className="transaction-list">
              {filteredTransactions.map((transaction) => (
                <div
                  className={
                    editingId === transaction.id
                      ? "transaction-row editing-row"
                      : "transaction-row"
                  }
                  key={transaction.id}
                >
                  <div className="transaction-main">
                    <div
                      className={
                        transaction.type === "income"
                          ? "transaction-icon income-icon"
                          : "transaction-icon expense-icon"
                      }
                    >
                      {transaction.type === "income" ? "+" : "-"}
                    </div>

                    <div>
                      <strong>{transaction.note || "No note"}</strong>
                      <span>
                        {transaction.category_name || "Uncategorized"} ·{" "}
                        {new Date(
                          transaction.transaction_date
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="transaction-actions">
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

                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(transaction)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default Transactions;