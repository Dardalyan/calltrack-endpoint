const jwt = require("jsonwebtoken");
const User = require("../../Model/User");
const express = require('express');
const router = express.Router();


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


router.get('/caltrack/reset/food-progress',resetFoodProgress);

module.exports = router;

