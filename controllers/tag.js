const DB = require('../models/tag');
const Helper = require('../utils/helper');

const all = async (req, res) => {
   let result = await DB.find();
   Helper.fMsg(res, "All Tags", result);
}

const add = async (req, res, next) => {
   let dbTag = await DB.findOne({ name: req.body.name });
   if (dbTag) {
      next(new Error("Tag name is already in use!"));
   } else {
      let result = await new DB(req.body).save();
      Helper.fMsg(res, "New Tag Added", result);
   }
}

const get = async (req, res, next) => {
   let result = await DB.findById(req.params.id);
   if (result) {
      Helper.fMsg(res, 'Single Tag', result);
   } else {
      next(new Error("No tag with that id"));
   }
}

const drop = async (req, res, next) => {
   let result = await DB.findById(req.params.id);
   if (result) {
      await DB.findByIdAndDelete(result._id);
      Helper.fMsg(res, 'Tag Deleted');
   } else {
      next(new Error("No tag with that id"));
   }
}
const patch = async (req, res, next) => {
   let dbTag = await DB.findById(req.params.id);
   if (dbTag) {
      await DB.findByIdAndUpdate(dbTag._id, req.body);
      let result = await DB.findById(dbTag._id);
      Helper.fMsg(res, 'Tag Updated', result);
   } else {
      next(new Error("No tag with that id"));
   }
}

module.exports = {
   all,
   add,
   drop,
   get,
   patch
}