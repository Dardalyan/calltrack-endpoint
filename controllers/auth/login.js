const Auth = require("../../Model/Auth");
const User = require("../../Model/User");
const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();

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

router.post('/caltrack/login',login);

module.exports = router;
