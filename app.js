require('dotenv').config();
const express = require('express'),
   app = express(),
   server = require('http').createServer(app),
   io = require('socket.io')(server),
   mongoose = require('mongoose'),
   jwt = require('jsonwebtoken'),
   helper = require('./utils/helper'),
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
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');

const { validateToken, validateRole } = require('./utils/validator');
const { emit } = require('process');
const { on } = require('events');

app.use('/permits', permitRouter);
app.use('/roles', validateToken(), validateRole("Owner"), roleRouter);
app.use('/users', userRouter);
app.use('/cats', catRoute);
app.use('/subcats', subcatRoute);
app.use('/childcats', childCatRoute);
app.use('/tags', tagRoute);
app.use('/delivery', deliveryRoute);
app.use('/warranty', warrantyRoute);
app.use('/products', productRouter);
app.use('/orders', orderRouter);

app.use((err, req, res, next) => {
   err.status = err.status || 500;
   res.status(err.status).json({ con: false, msg: err.message });
});

io.of('/chat').use(async (socket, next) => {
   let token = socket.handshake.query.token;
   if (token) {
      let decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (decoded) {
         let user = await helper.get(decoded._id);
         if (user) {
            socket.userData = user;
            next();
         } else {
            next(new Error("Tokenization Error"));
         }
      } else {
         next(new Error("Tokenization Error"));
      }
   } else {
      next(new Error("Tokenization Error"));
   }
}).on('connection', socket => {
   require('./utils/chat').initialize(io, socket);
});

// io.on('connection', socket => {
//    socket.on("test", data => {
//       console.log("User send data", data);
//       socket.emit("success",{"greet":"Hello Client"})
//    })
// });

const defaultData = async () => {
   let migratior = require('./migrations/migrator');
   // await migratior.migrate();
   // await migratior.backup();
   // await migratior.rpMigrate();
   // await migratior.addOwnerRole();
}
// defaultData();

server.listen(process.env.PORT, console.log(`Server is running at port ${process.env.PORT}`));

