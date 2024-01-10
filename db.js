const { initializeApp } = require("firebase/app");
const firebase_auth = require('firebase/auth');

require('dotenv').config();

const firebase_admin =require('firebase-admin');

const client_appconfig = {
    apiKey: process.env.FIREBASE_CL_APIKEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

let admin_appconfig = {
    credential: firebase_admin.credential.cert(JSON.parse(process.env.FIRE_ADMIN)),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN
};

// Initialize Firebase
const cl_app = initializeApp(client_appconfig);
const adm_app = firebase_admin.initializeApp(admin_appconfig);

const client_auth = firebase_auth.getAuth(cl_app);

let db = adm_app.firestore();

let categoryCollection = db.collection("category");
let foodCollection = db.collection("food");
let userInfo = db.collection("userInfo");


module.exports = {
    "category":categoryCollection,
    "food":foodCollection,
    "userInfo":userInfo,
    "client_auth":client_auth
}
