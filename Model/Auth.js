const client_auth = require('../db').client_auth;
const  {signInWithEmailAndPassword } = require("firebase/auth");
const {getAuth} = require("firebase-admin/auth");


class Auth {

    signIn = async (email,password)=>{
        let userCredential
        try{
            userCredential =  await signInWithEmailAndPassword(client_auth,email,password);
            return userCredential.user;
        }catch (e){
            console.log(e);
            return null;
        }
    }

    getAuthUser = async (uid)=>{
        let userRecord = await getAuth().getUser(uid);
        return userRecord.toJSON();
    }

}

module.exports = Auth;