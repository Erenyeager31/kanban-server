const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { body, validationResult } = require('express-validator')

//?Importing the models for db
const USER = require('../../models/User')

const mycache = require('../../cache/cacheModule')

const mail = process.env.mail
const password = process.env.password

const JWT_SECRET = process.env.JWT_SECRET

const sendOTP = async (req, res) => {
    //! Storing the validation results
    const errors = validationResult(req)
    //! Sending the errors to the client
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()
        })
    }

    const { email,message } = req.body

    try {
        //! Checking if the user exists by the means of email
        let user = await USER.findOne({ email: email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            })
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mail,
                pass: password, // Use the App Password generated in your Gmail Account settings
            },
        });

        const digits = '0123456789'
        let otp = ''
        for(let i = 0;i<6;i++){
            otp += digits[Math.floor(Math.random() * 10)]
        }
        const status = mycache.set(email,otp,10000)
        if(status){
            console.log(mycache.get(email))
        }

        const mailOptions = {
            from: mail,
            to: email,
            subject: message,
            html: '<body>' +
                '<div style="background-color: #1d3557; border:2px solid yellow; color: #fffcf2; font-family:Verdana, Geneva, Tahoma, sans-serif; width: 95%; padding:1% ">' +
                '<h1>OTP : ' + otp + '</h1>'+
                '</div>' +
                '</body>'
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent successfully:', info.messageId);
            }
        });

        return res.status(200)
            .json({
                success: true,
                message: "OTP has been send to your email",
            })
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Some error has occured, please try again later 🙏",
            error: error.message
        })
    }
}

module.exports = sendOTP