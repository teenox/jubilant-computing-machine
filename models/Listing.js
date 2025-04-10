const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startingPrice: { type: Number, required: true },
  status: { type: String, default: 'pending' },
});

module.exports = mongoose.model('Listing', listingSchema);
