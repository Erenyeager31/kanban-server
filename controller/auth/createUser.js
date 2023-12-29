const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
// var jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')

//?Importing the models for db
const USER = require('../../models/User')
const cache = require('node-cache')

const mail = process.env.mail
const password = process.env.password

const JWT_SECRET = process.env.JWT_SECRET

const createUser = async (req, res) => {
    //! Storing the validation results
    const errors = validationResult(req)

    //! Sending the errors to the client
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()
        })
    }

    const { name, email, password } = req.body

    //! Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt)

    try {
        //! Checking if the user already exists by the means of email
        let user = await USER.findOne({ email: email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        //! Creation of new User
        user = await USER.create({
            name: name,
            email: email,
            password: hashed_password
        })

        //? no need to generate authtoken during signup
        // const data = {
        //     user:{
        //         id:user._id
        //     }
        // }

        //! creating Authtoken
        // const authtoken = jwt.sign(data,JWT_SECRET)

        return res.status(200).json({
            success: true,
            message: "Account created Successfully",
            // authtoken:authtoken
        })
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Some error Occured, please try again later 🙏",
            error:error.message
        })
    }
}

module.exports = createUser