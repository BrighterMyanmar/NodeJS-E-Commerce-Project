const DB = require('../models/subcat');
const CatDB = require('../models/category');
const Helper = require('../utils/helper');

const all = async (req, res) => {
   let result = await DB.find();
   Helper.fMsg(res, "All Sub Categories", result);
}
const get = async (req, res, next) => {
   let dbSubcat = await DB.findById(req.params.id);
   if (dbSubcat) {
      Helper.fMsg(res, "Single Sub Category", dbSubcat);
   } else {
      next(new Error("No Sub Category with that id"));
   }
}
const add = async (req, res, next) => {
   let dbSubcat = await DB.findOne({ name: req.body.name });
   if (dbSubcat) {
      next(new Error("Sub Category name is already in use!"));
   } else {
      let dbCat = await CatDB.findById(req.body.catId);
      if (dbCat) {
         let result = await new DB(req.body).save();
         await CatDB.findByIdAndUpdate(dbCat._id, { $push: { subcats: result._id } });
         Helper.fMsg(res, "All Sub Categories", result);
      } else {
         next(new Error("No category with that id"));
      }
   }
}
const drop = async (req, res, next) => {
   let dbSubcat = await DB.findById(req.params.id);
   if (dbSubcat) {
      await CatDB.findByIdAndUpdate(dbSubcat.catId, { $pull: { subcats: dbSubcat._id } });
      await DB.findByIdAndDelete(dbSubcat._id);
      Helper.fMsg(res, "Sub Category Dropped");
   } else {
      next(new Error("No Sub Category with that id"));
   }
}
const patch = async (req, res, next) => {
   let dbSubcat = await DB.findById(req.params.id);
   if (dbSubcat) {
      await DB.findByIdAndUpdate(dbSubcat._id, req.body);
      let result = await DB.findById(dbSubcat._id);
      Helper.fMsg(res, "Sub Category Patched", result);
   } else {
      next(new Error("No Sub Category with that id"));
   }
}

module.exports = {
   get,
   all,
   add,
   drop,
   patch
}