const Status = require('../models/Status');

exports.getStatus = async (req, res) => {
  console.log('----------holaGET')
  
  try {
    const users = await Status.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
