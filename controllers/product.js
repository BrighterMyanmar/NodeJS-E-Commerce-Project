const DB = require('../models/product');
const Helper = require('../utils/helper');

const add = async (req, res, next) => {
   let dbProduct = await DB.findOne({ name: req.body.name });
   if (dbProduct) {
      next(new Error("Product name is already in use!"));
   } else {
      req.body.features = req.body.features.split(',');
      req.body.delivery = req.body.delivery.split(',');
      req.body.warranty = req.body.warranty.split(',');
      req.body.colors = req.body.colors.split(',');
      let result = await new DB(req.body).save();
      Helper.fMsg(res, "Product Saved!", result);
   }
}

const paginate = async (req, res) => {
   let pageNo = Number(req.params.page);
   const limit = Number(process.env.PAGE_LIMIT);
   const reqPage = pageNo == 1 ? 0 : pageNo - 1;
   const skipCount = limit * reqPage;
   let result = await DB.find().skip(skipCount).limit(limit);
   Helper.fMsg(res, `Paginated Page No ${pageNo}`, result);
}

const get = async (req, res, next) => {
   let dbProduct = await DB.findById(req.params.id);
   if (dbProduct) {
      Helper.fMsg(res, "Single Product", dbProduct);
   } else {
      next(new Error("No product with that id"));
   }
}

const drop = async (req, res, next) => {
   let dbProduct = await DB.findById(req.params.id);
   if (dbProduct) {
      await DB.findByIdAndDelete(dbProduct._id);
      Helper.fMsg(res, "Single Product Deleted");
   } else {
      next(new Error("No product with that id"));
   }
}

const patch = async (req, res, next) => {
   let dbProduct = await DB.findById(req.params.id);
   if (dbProduct) {
      await DB.findByIdAndUpdate(dbProduct._id, req.body);
      Helper.fMsg(res, "Single Product Updated");
   } else {
      next(new Error("No product with that id"));
   }
}

const filterBy = async (req, res) => {
   let type = req.params.type;
   let pageNo = Number(req.params.page);
   const limit = Number(process.env.PAGE_LIMIT);
   const reqPage = pageNo == 1 ? 0 : pageNo - 1;
   const skipCount = limit * reqPage;

   let filterType = 'cat';
   switch (type) {
      case 'cat': filterType = 'cat'; break;
      case 'subcat': filterType = 'subcat'; break;
      case 'childcat': filterType = 'childcat'; break;
      case 'tag': filterType = 'tag'; break;
   }
   let filterObj = {};
   filterObj[`${filterType}`] = req.params.id;
   let result = await DB.find(filterObj).skip(skipCount).limit(limit);
   Helper.fMsg(res, `Paginated Page No ${pageNo}`, result);
}

module.exports = {
   add,
   paginate,
   get,
   drop,
   patch,
   filterBy
}

