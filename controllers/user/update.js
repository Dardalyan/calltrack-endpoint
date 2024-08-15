const jwt = require("jsonwebtoken");
const User = require("../../Model/User");
const express = require('express');
const router = express.Router();

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

router.post('/caltrack/update/personalInfo',updateInfo);

module.exports = router;

