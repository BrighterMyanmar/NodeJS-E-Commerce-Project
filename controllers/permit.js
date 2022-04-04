const DB = require('../models/permit');
const Helper = require('../utils/helper');

const all = async (req, res, next) => {
   let permits = await DB.find().select('-__v');
   Helper.fMsg(res, 'All Permissions', permits);
}
const get = async (req, res, next) => {
   let permit = await DB.findById(req.params.id).select('-__v');
   if (permit) {
      Helper.fMsg(res, 'Single Permission', permit);
   } else {
      next(new Error("No Permission with that id"));
   }
}

const add = async (req, res, next) => {
   let dbPermit = await DB.findOne({ name: req.body.name });
   if (dbPermit) {
      next(new Error("Permission Name is already in use"));
   } else {
      let result = await new DB(req.body).save();
      Helper.fMsg(res, "Permission Saved!", result);
   }
}

const patch = async (req, res, next) => {
   let dbPermit = await DB.findById(req.params.id);
   if (dbPermit) {
      await DB.findByIdAndUpdate(dbPermit._id, req.body);
      let result = await DB.findById(dbPermit._id);
      Helper.fMsg(res, "Permission Updated!", result);
   } else {
      next(new Error("No Permission with that id"));
   }
}

const drop = async (req, res, next) => {
   let permit = await DB.findById(req.params.id);
   if (permit) {
      await DB.findByIdAndDelete(permit._id);
      Helper.fMsg(res, 'Permission Deleted!');
   } else {
      next(new Error("No Permission with that id"));
   }
}


module.exports = {
   all,
   get,
   add,
   patch,
   drop
}