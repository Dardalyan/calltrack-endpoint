const User = require("../../Model/User");
const express = require('express');
const router = express.Router();

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

router.post('/caltrack/create/user',createUser);

module.exports = router;
