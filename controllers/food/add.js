const jwt = require("jsonwebtoken");
const User = require("../../Model/User");
const express = require('express');
const router = express.Router();


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


router.post('/caltrack/add/food',addFood);

module.exports = router;

