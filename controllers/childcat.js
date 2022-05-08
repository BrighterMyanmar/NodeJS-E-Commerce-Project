const DB = require('../models/childcat');
const SubCatDB = require('../models/subcat');
const Helper = require('../utils/helper');

const all = async (req, res) => {
   let result = await DB.find();
   Helper.fMsg(res, "All Child Categories", result);
}

const add = async (req, res, next) => {
   let dbChildCat = await DB.findOne({ name: req.body.name });
   if (dbChildCat) {
      next(new Error("Child Category name is already in use"));
   } else {
      let subCat = await SubCatDB.findById(req.body.subcatId);
      if (subCat) {
         let result = await new DB(req.body).save();
         await SubCatDB.findByIdAndUpdate(subCat._id, { $push: { childcats: result._id } });
         Helper.fMsg(res, "Child Category save", result);
      } else {
         next(new Error("No Sub Category with that is"));
      }
   }
}

const get = async (req, res, next) => {
   let dbChildCat = await DB.findById(req.params.id);
   if (dbChildCat) {
      Helper.fMsg(res, "Single Child Category", dbChildCat);
   } else {
      next(new Error("No Child category with that id"));
   }
}
const drop = async (req, res, next) => {
   let dbChildCat = await DB.findById(req.params.id);
   if (dbChildCat) {
      await SubCatDB.findByIdAndUpdate(dbChildCat.subcatId, { $pull: { childcats: dbChildCat._id } });
      await DB.findByIdAndDelete(dbChildCat._id);
      Helper.fMsg(res, "Deleted Child Category");
   } else {
      next(new Error("No Child category with that id"));
   }
}

const patch = async (req, res, next) => {
   let dbChildCat = await DB.findById(req.params.id);
   if (dbChildCat) {
      await DB.findByIdAndUpdate(dbChildCat._id, req.body);
      let result = await DB.findById(dbChildCat._id);
      Helper.fMsg(res, "Child Category Updated", result);
   } else {
      next(new Error("No Child category with that id"));
   }
}

module.exports = {
   all,
   add,
   get,
   drop,
   patch
}