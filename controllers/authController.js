const { model } = require('mongoose');
const { resolve, reject } = require('promise');
const Promise = require('promise');
const { response } = require('../app');
const userBase = require('../models/userSchema')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv').config()

// console.log("hello", process.env.TWILIO_ACCOUNT_SID)
// config = {
//     serviceID: "MG17090d896e22ffc513bc6d3388c6fe96",
//     accountSID: "AC80c566cfa98c909a1859d1bce1eeb2a4",
//     authToken: "39fc5c2efff5874792aa8251037733be",
// };
// const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
try {
    const accountsid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const client = require('twilio')(accountsid, authToken)
    console.log(accountsid);
}catch(err){
    console.log(err);
}

module.exports = {
    createService: (done) => {
        var ser;
        client.verify.v2.services
            .create({ friendlyName: "My First Verify Service" })
            .then((service) => {
                done(service.sid)
            });
    },
    getOtp: (sid, mobile) => {
        console.log(sid);
        mobile = "+91" + mobile;
        return new Promise((resolve, reject) => {
            client.verify.v2
                .services(sid)
                .verifications.create({ to: mobile, channel: "sms" })
                .then((response) => {
                    resolve(response);
                    console.log("promise done");
                });
        });
    },
    verifyOTP: (sid, mobile, otp) => {

        // console.log(sid);
        // console.log(mobile);
        // console.log(otp);

        mobile = '+91' + mobile;
        return new Promise((resolve, reject) => {
            client.verify.v2.services(sid)
                .verificationChecks
                .create({ to: mobile, code: otp })
                .then(verification_check => resolve(verification_check.status));
        })
    },
    userSignup: async (userData) => {
        console.log("iam here");
        userData.password = await bcrypt.hash(userData.password, 10);
        console.log(userData.password);
        const newUser = new userBase.model({
            username: userData.name,
            email: userData.email,
            mobile: userData.mobile,
            password: userData.password,
            banned: 0
        });
        newUser.save(function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(result)
            }
        })


    }
}