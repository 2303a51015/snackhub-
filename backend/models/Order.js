const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  snackId:   String,
  name:      String,
  emoji:     String,
  price:     Number,
  qty:       Number,
  type:      { type: String, enum: ['delivery', 'pickup'] },
  ownerId:   String,
  ownerName: String,
  ownerRoom: String,
});

const orderSchema = new mongoose.Schema({
  buyerId:     { type: String, required: true },
  buyerName:   { type: String, required: true },
  items:       [orderItemSchema],
  total:       Number,
  delivFee:    Number,
  status:      { type: String, enum: ['pending','pickup','delivered'], default: 'pending' },
  deliveredAt: Date,
  // tracks which sellers have dispatched: { sellerId: timestamp }
  dispatchedBy: { type: Map, of: Number, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
