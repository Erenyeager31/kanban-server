const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { body, validationResult } = require('express-validator')

const mycache = require('../../cache/cacheModule')

//?Importing the models for db
const USER = require('../../models/User')
const cache = require('node-cache')
const nodecache = new cache({ stdTTL: 600 })

const mail = process.env.mail
const password = process.env.password

const JWT_SECRET = process.env.JWT_SECRET

const verifyOTP = async (req, res) => {
    //! Storing the validation results
    const errors = validationResult(req)
    //! Sending the errors to the client
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()
        })
    }

    try {
        const { email, OTP } = req.body
        console.log(email,OTP)

        const cachedOTP = mycache.get(email)
        // console.log(cachedOTP)
        if (!cachedOTP || cachedOTP !== OTP) {
            return res.status(200).json({
                status: false,
                message: "Please enter a valid OTP",
                OTP,
                cachedOTP
            })
        }

        if (cachedOTP === OTP) {
            return res.status(200)
            .json({
                success: true,
                message: "Email verified",
            })
        }
        
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Some error has occured, please try again later 🙏",
            error: error.message
        })
    }
}

module.exports = verifyOTP