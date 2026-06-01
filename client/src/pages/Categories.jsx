import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import api from "../api/axios";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.categories);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      type: "expense",
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      type: category.type,
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
      if (editingId) {
        await api.put(`/categories/${editingId}`, formData);
      } else {
        await api.post("/categories", formData);
      }

      resetForm();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this category? Existing transactions will become Uncategorized."
    );

    if (!confirmed) return;

    try {
      await api.delete(`/categories/${id}`);

      if (editingId === id) {
        resetForm();
      }

      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <AppLayout
      title="Categories"
      subtitle="Organize your money by income and expense categories."
    >
      {error && <div className="alert alert-error">{error}</div>}

      <div className="two-column-grid">
        <div className="panel-card">
          <div className="section-heading">
            <div>
              <h2>{editingId ? "Edit category" : "Add category"}</h2>
              <p>
                {editingId
                  ? "Update an existing category."
                  : "Create custom labels for your transactions."}
              </p>
            </div>
          </div>

          <form className="app-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Category name</label>
              <input
                type="text"
                name="name"
                placeholder="Food, Salary, Rent..."
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <button className="btn btn-primary" type="submit">
              {saving
                ? "Saving..."
                : editingId
                ? "Update category"
                : "Create category"}
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
              <h2>Your categories</h2>
              <p>All categories connected to your account.</p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="empty-state">No categories yet.</div>
          ) : (
            <div className="category-list">
              {categories.map((category) => (
                <div
                  className={
                    editingId === category.id
                      ? "category-row editing-row"
                      : "category-row"
                  }
                  key={category.id}
                >
                  <div>
                    <strong>{category.name}</strong>
                    <span>{category.type}</span>
                  </div>

                  <div className="category-actions">
                    <span
                      className={
                        category.type === "income"
                          ? "badge badge-income"
                          : "badge badge-expense"
                      }
                    >
                      {category.type}
                    </span>

                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(category.id)}
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

export default Categories;