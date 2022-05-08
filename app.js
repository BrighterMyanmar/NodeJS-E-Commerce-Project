require('dotenv').config();
const express = require('express'),
   app = express(),
   mongoose = require('mongoose'),
   fileupload = require('express-fileupload');

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DbName}`);

app.use(express.json());
app.use(fileupload());

const permitRouter = require('./routes/permit');
const roleRouter = require('./routes/role');
const userRouter = require('./routes/user');
const catRoute = require('./routes/category');
const subcatRoute = require('./routes/subcat');
const childCatRoute = require('./routes/childcat');
const tagRoute = require('./routes/tag');
const deliveryRoute = require('./routes/delivery');
const warrantyRoute = require('./routes/warranty');

const { validateToken, validateRole } = require('./utils/validator');

app.use('/permits', permitRouter);
app.use('/roles', validateToken(), validateRole("Owner"), roleRouter);
app.use('/users', userRouter);
app.use('/cats', catRoute);
app.use('/subcats', subcatRoute);
app.use('/childcats', childCatRoute);
app.use('/tags', tagRoute);
app.use('/delivery', deliveryRoute);
app.use('/warranty', warrantyRoute);

app.use((err, req, res, next) => {
   err.status = err.status || 500;
   res.status(err.status).json({ con: false, msg: err.message });
});

const defaultData = async () => {
   let migratior = require('./migrations/migrator');
   // await migratior.migrate();
   // await migratior.backup();
   // await migratior.rpMigrate();
   // await migratior.addOwnerRole();
}
// defaultData();

app.listen(process.env.PORT, console.log(`Server is running at port ${process.env.PORT}`));