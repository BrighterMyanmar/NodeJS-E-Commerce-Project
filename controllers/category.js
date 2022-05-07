const DB = require('../models/category');
const Helper = require('../utils/helper');

const all = async (req, res, next) => {
   let result = await DB.find().populate('subcats');
   Helper.fMsg(res, "All Categories", result);
}
const add = async (req, res, next) => {
   const dbCat = await DB.findOne({ name: req.body.name });
   if (dbCat) {
      next(new Error("Category Name is already in use"));
   } else {
      let result = await new DB(req.body).save();
      Helper.fMsg(res, "Category Save!", result);
   }
}
const get = async (req, res, next) => {
   const dbCat = await DB.findById(req.params.id);
   if (dbCat) {
      Helper.fMsg(res, "Single Category", dbCat);
   } else {
      next(new Error("No category with that is"));
   }
}
const drop = async (req, res, next) => {
   const dbCat = await DB.findById(req.params.id);
   if (dbCat) {
      await DB.findByIdAndDelete(dbCat._id);
      Helper.fMsg(res, "Category Deleted");
   } else {
      next(new Error("No category with that is"));
   }
}

const patch = async (req, res, next) => {
   const dbCat = await DB.findById(req.params.id);
   if (dbCat) {
      await DB.findByIdAndUpdate(dbCat._id, req.body);
      let result = await DB.findById(dbCat._id);
      Helper.fMsg(res, "Category Patched", result);
   } else {
      next(new Error("No category with that is"));
   }
}


module.exports = {
   add,
   all,
   get,
   drop,
   patch
}