const DB = require('../models/warranty');
const Helper = require('../utils/helper');

const all = async (req, res) => {
   let result = await DB.find();
   Helper.fMsg(res, "All Warranties", result);
}

const add = async (req, res, next) => {
   let dbWarranty = await DB.findOne({ name: req.body.name });
   if (dbWarranty) {
      next(new Error("Warranty name is already in use!"));
   } else {
      req.body.remark = req.body.remark.split(',');
      let result = await new DB(req.body).save();
      Helper.fMsg(res, "New Warranty Saved!", result);
   }
}

const get = async (req, res, next) => {
   let dbWarranty = await DB.findById(req.params.id);
   if (dbWarranty) {
      Helper.fMsg(res, "Single Warranty", dbWarranty);
   } else {
      next(new Error("No warranty with that id"));
   }
}
const drop = async (req, res, next) => {
   let dbWarranty = await DB.findById(req.params.id);
   if (dbWarranty) {
      await DB.findByIdAndDelete(dbWarranty._id);
      Helper.fMsg(res, "Single Warranty Deleted");
   } else {
      next(new Error("No warranty with that id"));
   }
}
const patch = async (req, res, next) => {
   let dbWarranty = await DB.findById(req.params.id);
   if (dbWarranty) {
      await DB.findByIdAndUpdate(dbWarranty._id, req.body);
      let result = await DB.findById(dbWarranty._id);
      Helper.fMsg(res, "Single Warranty Updated",result);
   } else {
      next(new Error("No warranty with that id"));
   }
}

module.exports = {
   all,
   add,
   get,
   drop,
   patch
}