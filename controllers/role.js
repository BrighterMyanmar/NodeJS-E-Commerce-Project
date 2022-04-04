const DB = require('../models/role');
const PermitDB = require('../models/permit');
const Helper = require('../utils/helper');

const all = async (req, res, next) => {
   let roles = await DB.find().populate('permits', '-__v');
   Helper.fMsg(res, "All Roles", roles);
}

const get = async (req, res, next) => {
   let dbRole = await DB.findById(req.params.id).select('-__v');
   if (dbRole) {
      Helper.fMsg(res, "Single Role", dbRole);
   } else {
      next(new Error("No Role with that id"));
   }
}

const add = async (req, res, next) => {
   let dbRole = await DB.findOne({ name: req.body.name });
   if (dbRole) {
      next(new Error("Role name is already in use"));
   } else {
      let result = await new DB(req.body).save();
      Helper.fMsg(res, "New Role Added", result);
   }
}

const patch = async (req, res, next) => {
   let dbRole = await DB.findById(req.params.id).select('-__v');
   if (dbRole) {
      await DB.findByIdAndUpdate(dbRole._id, req.body);
      let updateRole = await DB.findById(dbRole._id).select('-__v');
      Helper.fMsg(res, "Role Patched", updateRole);
   } else {
      next(new Error("No Role with that id"));
   }
}
const drop = async (req, res, next) => {
   let dbRole = await DB.findById(req.params.id).select('-__v');
   if (dbRole) {
      await DB.findByIdAndDelete(dbRole._id);
      Helper.fMsg(res, "Role Deleted");
   } else {
      next(new Error("No Role with that id"));
   }
}

const roleAddPermit = async (req, res, next) => {
   let dbRole = await DB.findById(req.body.roleId);
   let dbPermit = await PermitDB.findById(req.body.permitId);

   if (dbRole && dbPermit) {
      await DB.findByIdAndUpdate(dbRole._id, { $push: { permits: dbPermit._id } });
      let result = await DB.findById(dbRole._id);
      Helper.fMsg(res, "Permit Add to Role", result);
   } else {
      next(new Error("Role Id and Permit Id need to be valided!"));
   }
}
const roleRemovePermit = async (req, res, next) => {
   let dbRole = await DB.findById(req.body.roleId);
   let dbPermit = await PermitDB.findById(req.body.permitId);

   if (dbRole && dbPermit) {
      await DB.findByIdAndUpdate(dbRole._id, { $pull: { permits: dbPermit._id } });
      let result = await DB.findById(dbRole._id);
      Helper.fMsg(res, "Permit Remove from Role", result);
   } else {
      next(new Error("Role Id and Permit Id need to be valided!"));
   }
}

module.exports = {
   all,
   get,
   add,
   patch,
   drop,
   roleAddPermit,
   roleRemovePermit
}