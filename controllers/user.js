const DB = require('../models/user');
const RoleDB = require('../models/role');
const PermitDB = require('../models/permit');
const Helper = require('../utils/helper');

const register = async (req, res, next) => {
   let dbEmailUser = await DB.findOne({ email: req.body.email });
   if (dbEmailUser) {
      next(new Error("Email is already in Use!"));
      return;
   }

   let dbPhoneUser = await DB.findOne({ phone: req.body.phone });
   if (dbPhoneUser) {
      next(new Error("Phone is already in Use!"));
      return;
   }

   req.body.dbPhoneUser = Helper.encode(req.body.password);
   let result = await new DB(req.body).save();
   Helper.fMsg(res, "Register Success", result);
}

const login = async (req, res, next) => {
   let dbUser = await DB.findOne({ phone: req.body.phone }).populate('roles permits').select('-__v');
   if (dbUser) {
      if (Helper.comparePass(req.body.password, dbUser.password)) {
         let user = dbUser.toObject();
         delete user.password;
         user.token = Helper.makeToken(user);
         Helper.set(user._id, user);
         Helper.fMsg(res, "Login Success", user);
      } else {
         next(new Error("Creditial Error"));
      }
   } else {
      next(new Error("Creditial Error"));
   }
}

const addRole = async (req, res, next) => {
   let dbUser = await DB.findById(req.body.userId);
   let dbRole = await RoleDB.findById(req.body.roleId);

   let foundRole = dbUser.roles.find(rid => rid.equals(dbRole._id));
   if (foundRole) {
      next(new Error("Role already exist"));
   } else {
      await DB.findByIdAndUpdate(dbUser._id, { $push: { roles: dbRole._id } });

      let user = await DB.findById(dbUser._id);
      Helper.fMsg(res, "Added Role to User", user);
   }
}

const removeRole = async (req, res, next) => {
   let dbUser = await DB.findById(req.body.userId);

   let foundRole = dbUser.roles.find(rid => rid.equals(req.body.roleId));
   if (foundRole) {
      await DB.findByIdAndUpdate(dbUser._id, { $pull: { roles: req.body.roleId } });
      Helper.fMsg(res, "Role Removed");
   } else {
      next(new Error("Role doesn't exist"));
   }
}


const addPermit = async (req, res, next) => {
   let dbUser = await DB.findById(req.body.userId);
   let dbPermit = await PermitDB.findById(req.body.permitId);

   let foundPermit = dbUser.permits.find(rid => rid.equals(dbPermit._id));
   if (foundPermit) {
      next(new Error("Permit already exist"));
   } else {
      await DB.findByIdAndUpdate(dbUser._id, { $push: { permits: dbPermit._id } });

      let user = await DB.findById(dbUser._id);
      Helper.fMsg(res, "Added Permit to User", user);
   }
}
const removePermit = async (req, res, next) => {
   let dbUser = await DB.findById(req.body.userId);

   let foundpermit = dbUser.permits.find(pid => pid.equals(req.body.permitId));
   if (foundpermit) {
      await DB.findByIdAndUpdate(dbUser._id, { $pull: { permits: req.body.permitId } });
      Helper.fMsg(res, "Permit Remove From User");
   } else {
      next(new Error("User have not this permission"));
   }
}

module.exports = {
   register,
   login,
   addRole,
   removeRole,
   addPermit,
   removePermit
}