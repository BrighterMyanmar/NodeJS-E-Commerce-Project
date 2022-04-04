const fs = require('fs');
const UserDB = require('../models/user');
const Helper = require('../utils/helper');

const migrate = () => {
   let data = fs.readFileSync('./migrations/users.json');
   let users = JSON.parse(data);

   users.forEach(async (user) => {
      user.password = Helper.encode(user.password);
      let result = await new UserDB(user).save();
      console.log(result);
   });
}

const backup = async () => {
   let users = await UserDB.find();
   fs.writeFileSync('./migrations/backups/users.json', JSON.stringify(users));
   console.log("User DB Backuped!");
}

module.exports = {
   migrate,
   backup
}