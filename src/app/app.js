const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
//const User = require('./api/models/userModel');
const jsonwebtoken = require('jsonwebtoken');

const hostname = "0.0.0.0";
const port = 3000;

const mongooseParams = {
  useUnifiedTopology: true,
  useNewUrlParse: true,
  useCreateIndex: true
}
mongoose.connect('mongodb://mongo/notation', mongooseParams);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});
app.use((req, res, next) => {
  if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'nodejs_api', (err, decode) => {
      if (err) {
        req.user = undefined;
      } else {
        req.user = decode;
      }
      next();
    })
  } else {
    req.user = undefined;
    next();
  }
})

//Routes
const userRoute = require('./api/routes/userRoute');
userRoute(app);


const sessionRoute = require('./api/routes/sessionRoute');
sessionRoute(app);

const moduleRoute = require('./api/routes/moduleRoute');
moduleRoute(app);

const noteRoute = require('./api/routes/noteRoute');
noteRoute(app);

app.listen(port, hostname);