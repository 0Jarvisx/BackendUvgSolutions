const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const users = await Category.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
