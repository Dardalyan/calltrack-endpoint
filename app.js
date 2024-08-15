//---------------------- Required Packages -------------------------
const express = require('express');
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');

require('dotenv').config();

const app = express();
const router = express.Router();

//---------------------- App Configs -------------------------
app.use(body_parser.urlencoded({extended:false}));
app.use(express.json());
app.use(cookie_parser());
//------------------------------------------------------------

const loginRouter = require('./controllers/auth/login');
const registerRouter = require('./controllers/auth/register');
const currentUserRouter = require('./controllers/user/current');
const updateUserRouter = require('./controllers/user/update');
const addFoodRouter = require('./controllers/food/add');
const deleteFoodRouter = require('./controllers/food/delete');
const listFoodRouter = require('./controllers/food/list');
const resetProgressRouter = require('./controllers/food/resetProgress');


app.use(loginRouter);
app.use(registerRouter);
app.use(currentUserRouter);
app.use(updateUserRouter);
app.use(addFoodRouter);
app.use(deleteFoodRouter);
app.use(listFoodRouter);
app.use(resetProgressRouter);

app.use(router);
app.listen(process.env.PORT || 3000);