const mongoose = require('mongoose')
const { Schema } = mongoose;

const UnreadSchema = new Schema({
   from: { type: Schema.Types.ObjectId, ref: "user", required: true },
   to: { type: Schema.Types.ObjectId, ref: "user", required: true },
   created: { type: Date, default: Date.now }
});

const Unread = mongoose.model('unread', UnreadSchema);
module.exports = Unread;
