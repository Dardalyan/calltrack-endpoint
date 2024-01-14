//---------------------- Required Packages -------------------------
const express = require('express');
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');
//const referances = require('./db');
const User = require('./Model/User');
const Auth = require('./Model/Auth');
const Food = require('./Model/Food');

let fs = require('fs');
let crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {initializeFirestore} = require("firebase-admin/firestore");
const {category} = require("./db");

require('dotenv').config();

const app = express();
const router = express.Router();

//---------------------- App Configs -------------------------
app.use(body_parser.urlencoded({extended:false}));
app.use(express.json());
app.use(cookie_parser());
//------------------------------------------------------------

let createUser = async(req,res)=>{
try{
    let data = req.body;
    let result = await new User().create(data);
    if(result == null)
        return res.status(404).json({"message":"User cannot be created !",'alert':'Your email might be already used !'});

    return res.status(200).json({"message":"User has been created successfully !"});
}catch (e){
    console.log(e);
    return res.status(401).json({'alert':'Sign Up Error !'});
    }
}

let login  = async(req,res)=>{
    try{
        let result = await new Auth().signIn(req.body.email,req.body.password);
        if(result == null)
            return res.status(401).json({"alert":"Access Denied !"});
        let userInfo = await new User().getInfo(result.uid);

        let token = jwt.sign({'uid':result.uid},process.env.JWT_SECRET_KEY,{expiresIn:'3h'});

        if(userInfo.age == null || userInfo.gender == null || userInfo.h== null || userInfo.w == null)
            return res.status(400).json({"token":token,'message':'Please enter your personal informations...'});

        return res.status(200).json({"token":token,"message":"Access Confirmed !"});
    }catch (e){
        console.log(e);
        return res.status(401).json({'alert':'Login Error !'});

    }
}

let updateInfo =async (req,res)=>{
    try{
        let token = req.headers.authorization.split(" ")[1];
        let uid;
        await jwt.verify(token,process.env.JWT_SECRET_KEY,(err,dec)=>{
            if(err != null)
                throw err;
            uid = dec.uid;
        });
        let result = await new User().update(uid,req.body);
        if(!result)
            return res.status(400).json({'message':'User has not been updated !'});

        return res.status(200).json({"message":"Your information has been updated !"});
    }catch (e){
        console.log(e);
        return res.status(401).json({'alert': 'Update Error !'});

    }

}

let getUserInfo = async (req,res) =>{
    try{

        let token = req.headers.authorization.split(" ")[1];
        let uid;
        await jwt.verify(token,process.env.JWT_SECRET_KEY,(err,dec)=>{
            if(err != null)
                throw err;
            uid = dec.uid;
        });
        let user = await new User().getInfo(uid);
        if( user == null)
            return res.status(401).json({'alert':'Access Denied !'});


        return res.status(200).json({"user":user});
    }catch (e){
        console.log(e);
        return res.status(401).json({'alert':'Access Denied !'});
    }
}


let getAllFood = async (req,res)=>{
    try{
        let token = req.headers.authorization.split(" ")[1];
        await jwt.verify(token,process.env.JWT_SECRET_KEY,(err,dec)=>{
            if(err != null)
                throw err;
        });

        let foodList = await new Food().getAllFood();

        if(foodList == null)
            return res.status(404).json({'alert':'No Food Found !'});


        return res.status(200).json({foodList});
    }catch (e){
        console.log(e);
        return res.status(401).json({'alert': 'Access Denied !'});

    }
}

let addFood = async (req,res)=>{
    try{
        let uid;
        let token = req.headers.authorization.split(" ")[1];
        await jwt.verify(token,process.env.JWT_SECRET_KEY,(err,dec)=>{
            if(err != null)
                throw err;
            uid = dec.uid;
        });
        let user = await new User().getInfo(uid);
        if(user == null){
            return res.status(404).json({"alert":"No User !"});
        }

        user.myFood.push(req.body);
        if(user.calorieHave + req.body['cal'] == user.calorieNeed){
            user.calorieHave = user.calorieNeed;
        }else{
            user.calorieHave += req.body['cal'];
        }
        let data = req.body;
        let result = await new User().update(uid,{'myFood':user.myFood,'calorieHave':user.calorieHave});

        return res.status(200).json({"message":"Your meal has been added succesfully !"});

    }catch (e){
        console.log(e);
        return res.status(401).json({"alert":"Access Denied !"});

    }
}
let deleteFood = async  (req,res)=>{
    try{
        let uid;
        let deletedFood = req.body;
        let token = req.headers.authorization.split(" ")[1];
        await jwt.verify(token,process.env.JWT_SECRET_KEY,(err,dec)=>{
            if(err != null)
                throw err;
            uid = dec.uid;
        });
        let user = await new User().getInfo(uid);
        if(user == null){
            return res.status(404).json({"alert":"No User !"});
        }


        for(let i =0;i<user.myFood.length;i++){
            if(user.myFood.at(i).amount == deletedFood.amount && user.myFood.at(i).name == deletedFood.name ){
                user.calorieHave -= deletedFood.cal;
                user.myFood.splice(i,1);
                break;
            }
        }

        await new User().update(uid,user);



        return res.status(200).json({"message":"Your meal has been deleted succesfully !"});

    }catch (e){
        console.log(e);
        return res.status(401).json({"alert":"Access Denied !"});

    }
}

let resetFoodProgress = async (req,res) =>{
    try{
        let uid;
        let token = req.headers.authorization.split(" ")[1];
        await jwt.verify(token,process.env.JWT_SECRET_KEY,(err,dec)=>{
            if(err != null)
                throw err;
            uid = dec.uid;
        });
        let user = await new User().getInfo(uid);
        if(user == null){
            return res.status(404).json({"alert":"No User !"});
        }

        user.myFood = [];
        user.calorieHave = 0;

        await new User().update(uid,user);

        return res.status(200).json({"message":"Your meal has been deleted succesfully !"});

    }catch (e){
        console.log(e);
        return res.status(401).json({"alert":"Access Denied !"});

    }
}



router.post('/caltrack/get/allFood',getAllFood);
router.get('/caltrack/reset/food-progress',resetFoodProgress);

router.post('/caltrack/add/food',addFood);
router.post('/caltrack/login',login);
router.delete('/caltrack/delete/food',deleteFood);
router.post('/caltrack/create/user',createUser);
router.get('/caltrack/get/info',getUserInfo);
router.post('/caltrack/update/personalInfo',updateInfo);

app.use(router);
app.listen(process.env.PORT || 3000);