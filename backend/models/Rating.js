const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  orderId:    { type: String, required: true },
  sellerId:   { type: String, required: true },
  raterId:    { type: String, required: true },
  stars:      { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

// one rating per (order + seller + rater)
ratingSchema.index({ orderId: 1, sellerId: 1, raterId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
