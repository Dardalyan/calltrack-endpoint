//---------------------- Required Packages -------------------------
const express = require('express');
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');
//const referances = require('./db');
const User = require('./Model/User');
const Auth = require('./Model/Auth');

let fs = require('fs');
let crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {initializeFirestore} = require("firebase-admin/firestore");

require('dotenv').config();

const app = express();
const router = express.Router();

//---------------------- App Configs -------------------------
app.use(body_parser.urlencoded({extended:false}));
app.use(express.json());
app.use(cookie_parser());
//------------------------------------------------------------

let createUser = async(req,res)=>{
    let data = req.body;
    let result = await new User().create(data);
    if(result == null)
       return res.status(400).json({"message":"User cannot be created !",'alert':'Your email might be already used !'});

    return res.status(200).json({"message":"User has been created successfully !"});
}
let login  = async(req,res)=>{
    console.log('asdasd')
    let result = await new Auth().signIn(req.body.email,req.body.password);
    if(result == null)
        return res.status(401).json({"alert":"Access Denied !"});
    let userInfo = await new User().getInfo(result.uid);
    if(userInfo.age == null || userInfo.gender == null || userInfo.h== null || userInfo.w == null)
        return res.status(400).json({'message':'Please enter your personal informations...'});
    let token = jwt.sign({'uid':result.uid},process.env.JWT_SECRET_KEY,{expiresIn:'3h'});
    res.cookie('token',token,{
        httpOnly:false,
        secure:true
    });

    return res.status(200).json({"token":token,"message":"Access Confirmed !"});
}

let getUserInfo = async (req,res) =>{
    try{

        let token = req.cookies.token;
        let uid;
        await jwt.verify(token,process.env.JWT_SECRET_KEY,(err,dec)=>{
            uid = dec.uid;
        });
        let user = await new User().getInfo(uid);
        if( user == null)
            return res.status(401).json({'alert':'Access Denied !'});

    }catch (e){
        console.log(e);
        return res.status(401).json({'alert':'Access Denied !'});
    }


    return res.status(200).json({"message":`${req.cookies.token}`,"user":user});
}

let addFood = async (req,res)=>{


    return res.status(200).json({"message":"Your meal has been added succesfully !"});
}


let deleteFood = async  (req,res)=>{


    return res.status(200).json({"message":"Your meal has been deleted succesfully !"});
}


let currentInfo = async (req,res) =>{

}
let updateInfo =async (req,res)=>{
    let token = req.cookies.token;
    let uid;
    await jwt.verify(token,process.env.JWT_SECRET_KEY,(err,dec)=>{
        uid = dec.uid;
    });
    let result = await new User().update(uid,req.body);
    if(!result)
        return res.status(400).json({'message':'User has not been updated !'});

    return res.status(200).json({"message":"Your information has been updated !"});

}


router.post('/caltrack/add/food',addFood);
router.post('/caltrack/login',login);
router.delete('/caltrack/delete/food',deleteFood);
router.post('/caltrack/create/user',createUser);
router.get('/caltrack/get/info',getUserInfo);
router.post('/caltrack/update/personalInfo',updateInfo);
router.get('/caltrack/get/currentInfo',currentInfo);

app.use(router);
app.listen(3000);