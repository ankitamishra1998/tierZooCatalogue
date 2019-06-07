const mongoose = require('mongoose');

const buildSchema = mongoose.Schema({
  mapId: { type: String, default: "mapId"},
  containerId: { type: String, default: "containerId"},
  countryCode: { type: String, default: "countryCode"},
  name: { type: String, required: true},
  intelligence: { type: Number, required: true},
  power: { type: Number, required: true},
  defense: { type: Number, required: true},
  mobility: { type: Number, required: true},
  health: { type: Number, required: true},
  stealth: { type: Number, required: true},
  tier: { type: String},
  location: { type: String, default: "location"},
  facts: [{ type: String, default: []}],
  image: { type: String, default: "image"}
});

module.exports = mongoose.model('Build', buildSchema);
