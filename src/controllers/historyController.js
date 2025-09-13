const History = require('../models/History')



 const saveHistory = async (req, res) => {
  console.log(req.body)
  try {

    const history = new History(req.body);
    await history.save();
    res.status(201).json({ success: true, data: history });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

 const getUserHistory = async (req, res) => {
  try {
    const history = await History.find({ userId: req.params.userId }).sort({ viewedAt: -1 });
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


module.exports = {
  getUserHistory,
  saveHistory
}