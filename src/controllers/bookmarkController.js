const Bookmark = require('../models/Bookmark');

// Create or toggle bookmark (idempotent)
exports.createOrRemove = async (req, res) => {
  try {
    const { itemType, itemId } = req.body;
    if (!itemType || !itemId) return res.status(400).json({ message: 'itemType and itemId are required' });

    const query = { user: req.user._id, itemType, itemId };
    const existing = await Bookmark.findOne(query);

    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      return res.status(200).json({ message: 'Bookmark removed', removed: true });
    }

    const created = await Bookmark.create(query);
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({ message: 'Already bookmarked' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// List bookmarks for logged in user, optional filter by type
exports.list = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.itemType = type;

    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if specific item is bookmarked
exports.isBookmarked = async (req, res) => {
  try {
    const { itemType, itemId } = req.query;
    if (!itemType || !itemId) return res.status(400).json({ message: 'itemType and itemId are required' });

    const exists = await Bookmark.exists({ user: req.user._id, itemType, itemId });
    res.json({ bookmarked: !!exists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a bookmark by id
exports.removeById = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Bookmark.findOneAndDelete({ _id: id, user: req.user._id });
    if (!removed) return res.status(404).json({ message: 'Bookmark not found' });
    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
