const mongoose =require("mongoose");

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // 🔹 Top-level category: resources, careers, multimedia
  categoryType: {
    type: String,
    enum: ["resources", "careers", "multimedia"],
    required: true,
  },

  // 🔹 Id of the actual item (resourceId / careerId / multimediaId)
  itemId: {
    type: String,
    required: true,
  },

  // 🔹 Display title
  title: {
    type: String,
    required: true,
  },

  // 🔹 Resources ke liye optional sub-category (Web Development, etc.)
  subCategory: {
    type: String,
    default: null,
  },

  // 🔹 Optional extra data (tags, salary, skills, etc.)
  meta: {
    type: Object,
    default: {},
  },

  viewedAt: {
    type: Date,
    default: Date.now,
  },
});

const History =mongoose.model("History", historySchema);
module.exports = History
