const mongoose = require('mongoose')
const { Schema } = mongoose;

const DeliverySchema = new Schema({
   name: { type: String, required: true, unique: true },
   price: { type: Number, require: true },
   duration: { type: String, required: true },
   image: { type: String, required: true },
   remark: { type: Array },
   created: { type: Date, default: Date.now }
});

const Delivery = mongoose.model('delivery', DeliverySchema);
module.exports = Delivery;
