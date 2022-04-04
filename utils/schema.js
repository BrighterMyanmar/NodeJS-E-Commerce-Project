const Joi = require('joi');

module.exports = {
   PermitSchema: {
      add: Joi.object({
         name: Joi.string().required()
      })
   },
   RoleSchema: {
      addPermit: Joi.object({
         roleId: Joi.string().regex(/^[0-9a-fA-f]{24}$/),
         permitId: Joi.string().regex(/^[0-9a-fA-f]{24}$/)
      })
   },
   AllSchema: {
      id: Joi.object({
         id: Joi.string().regex(/^[0-9a-fA-f]{24}$/)
      })
   }
}