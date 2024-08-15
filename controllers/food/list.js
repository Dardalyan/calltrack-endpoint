const jwt = require("jsonwebtoken");
const Food = require("../../Model/Food");
const express = require('express');
const router = express.Router();


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


router.post('/caltrack/get/allFood',getAllFood);

module.exports = router;
