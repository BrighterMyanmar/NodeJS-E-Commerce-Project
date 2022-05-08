const DB = require('../models/delivery');
const Helper = require('../utils/helper');

const all = async (req, res) => {
   let result = await DB.find();
   Helper.fMsg(res, "All Deliveries", result);
}

const add = async (req, res, next) => {
   let dbDelivery = await DB.findOne({ name: req.body.name });
   if (dbDelivery) {
      next(new Error("Delivery name is already in use"));
   } else {
      req.body.remark = req.body.remark.split(',');
      let result = await new DB(req.body).save();
      Helper.fMsg(res, "Delivery Saved!", result);
   }
}

const get = async (req, res, next) => {
   let result = await DB.findById(req.params.id);
   if (result) {
      Helper.fMsg(res, "Single Delivery", result);
   } else {
      next(new Error("No Delivery with that is"));
   }
}
const drop = async (req, res, next) => {
   let result = await DB.findById(req.params.id);
   if (result) {
      await DB.findByIdAndDelete(result._id);
      Helper.fMsg(res, "Single Delivery Delete");
   } else {
      next(new Error("No Delivery with that is"));
   }
}
const patch = async (req, res, next) => {
   let dbDelivery = await DB.findById(req.params.id);
   if (dbDelivery) {
      await DB.findByIdAndUpdate(dbDelivery._id, req.body);
      let result = await DB.findById(dbDelivery._id);
      Helper.fMsg(res, "Single Delivery Updated", result);
   } else {
      next(new Error("No Delivery with that is"));
   }
}

module.exports = {
   all,
   add,
   get,
   drop,
   patch
}
