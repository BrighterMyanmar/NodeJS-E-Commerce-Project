const mongoose = require('mongoose')
const { Schema } = mongoose;

const WarrantySchema = new Schema({
   name: { type: String, required: true, unique: true },
   image: { type: String, required: true },
   remark: { type: Array },
   created: { type: Date, default: Date.now }
});

const Warranty = mongoose.model('warranty', WarrantySchema);
module.exports = Warranty;
