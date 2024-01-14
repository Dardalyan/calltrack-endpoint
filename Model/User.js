const references = require("../db");
const {getAuth} = require("firebase-admin/auth");

class User{
    create = async (data)=>{
        let authResult;
        try{
            authResult = await getAuth().createUser(
                {
                    email: data.email,
                    emailVerified: true,
                    password: data.password,
                    displayName: data.name +' '+data.surname,
                    disabled: false,
                }
            );
            await references.userInfo.add(
                {
                    'age':null,
                    "calorieHave":0,
                    'exerciseFrequency':null,
                    'gender':null,
                    'h': null,
                    'target':null,
                    'w':null,
                    'uid': authResult.uid,
                    'myFood':[],
                    "calorieNeed":null,
                }
            );
            return authResult;
        }catch (e){
            console.log(e);
            return null;
        }
    }

    update = async (uid,newDataSet)=>{
        let docName;
        try{
            let snapshot = await references.userInfo.where('uid','==',uid).get();
            snapshot.forEach(doc=>{
                docName = doc.id;
            });
            await references.userInfo.doc(docName).update(newDataSet);
            return true;
        }catch (e){
            console.log(e);
            return false;
        }

    }

    getInfo = async(uid)=>{
        let user = null;
        try{
            let snaphot = await references.userInfo.where('uid','==',uid).get();
            snaphot.forEach(doc => {
                user = doc.data();
            });

            return user;
        }catch (e){
            console.log(e);
            return null;
        }
    }




}


module.exports  = User;
