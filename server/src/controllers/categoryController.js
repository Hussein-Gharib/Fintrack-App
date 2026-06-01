const pool = require("../config/db");

const getCategories = async (req, res) => {
  try {
    const categories = await pool.query(
      "SELECT * FROM categories WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );

    res.json({
      categories: categories.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        message: "Please provide name and type",
      });
    }

    if (type !== "income" && type !== "expense") {
      return res.status(400).json({
        message: "Type must be income or expense",
      });
    }

    const newCategory = await pool.query(
      `INSERT INTO categories (user_id, name, type)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, name, type]
    );

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        message: "Please provide name and type",
      });
    }

    if (type !== "income" && type !== "expense") {
      return res.status(400).json({
        message: "Type must be income or expense",
      });
    }

    const updatedCategory = await pool.query(
      `UPDATE categories
       SET name = $1, type = $2
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [name, type, id, req.user.id]
    );

    if (updatedCategory.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      message: "Category updated successfully",
      category: updatedCategory.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await pool.query(
      "DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (deletedCategory.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      message: "Category deleted successfully",
      category: deletedCategory.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};