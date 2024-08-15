const jwt = require("jsonwebtoken");
const User = require("../../Model/User");
const express = require('express');
const router = express.Router();

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


router.delete('/caltrack/delete/food',deleteFood);

module.exports = router;

