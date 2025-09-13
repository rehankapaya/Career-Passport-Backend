const mongoose =require("mongoose");

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  categoryType: {
    type: String,
    enum: ["resources", "careers", "multimedia"],
    required: true,
  },

  itemId: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  subCategory: {
    type: String,
    default: null,
  },

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
