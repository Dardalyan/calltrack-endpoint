const jwt = require("jsonwebtoken");
const User = require("../../Model/User");
const express = require('express');
const router = express.Router();

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

router.get('/caltrack/get/info',getUserInfo);

module.exports = router;

