const mongoose = require('mongoose');

const snackSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  cat:       { type: String, required: true },
  price:     { type: Number, required: true, min: 1 },
  qty:       { type: Number, required: true, min: 0 },
  emoji:     { type: String, default: '🍬' },
  desc:      { type: String, default: '' },
  ownerId:   { type: String, required: true },   // college ID
  ownerName: { type: String, required: true },
  ownerRoom: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Snack', snackSchema);
