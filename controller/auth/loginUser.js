const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')

//?Importing the models for db
const USER = require('../../models/User')
const cache = require('node-cache')

const mail = process.env.mail
const password = process.env.password

const JWT_SECRET = process.env.JWT_SECRET

const loginUser = async (req, res) => {
    //! Storing the validation results
    const errors = validationResult(req)
    console.log(JWT_SECRET)
    //! Sending the errors to the client
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()
        })
    }

    const { email, password } = req.body
    // console.log(email,password)

    try {
        //! Checking if the user exists by the means of email
        let user = await USER.findOne({ email: email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Please Login with valid credentials"
            })
        }

        //! if exists checking the password with the hashed password
        const pass_verification = await bcrypt.compare(password, user.password)

        if (!pass_verification) {
            return res.status(400).json({
                success: false,
                message: "Please login with correct password"
            })
        }

        const data = {
            user: {
                id: user._id
            }
        }

        //! creating Authtoken
        const authtoken = jwt.sign(data, JWT_SECRET)

        return res.status(200)
            .cookie("authtoken", authtoken,
                {
                    path: "/",
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    httpOnly: true,
                    sameSite: "strict"
                })
            .json({
                success: true,
                message: "Logged-in successfully",
                user
            })
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Some error has occured, please try again later 🙏",
            error:error.message
        })
    }
}

module.exports = loginUser