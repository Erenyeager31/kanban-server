const express = require('express')
const wsRouter = express.Router()
// const bcrypt = require('bcryptjs')
// var jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const nodemailer = require('nodemailer')

//?Importing the models for db
const USER = require('../../models/User')
const WORKSPACE = require('../../models/Workspace')
const REQUEST = require('../../models/Requests')

//? smtp
const mail = process.env.mail
const password = process.env.password

const JWT_SECRET = process.env.JWT_SECRET

const fetchRequests = async (req, res) => {
    try {
        //! fetching the user details
        //req.user is a part attached at middleware and req.user contains a json within itself
        const UserId = await req.id.user.id
        let user = await USER.findById(UserId)
        console.log(user)
        const request_list = await REQUEST.find({ to_email: user.email })

        return res.status(200).json({
            success:true,
            request_list: request_list
        })
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Some error Occured, please try again later 🙏",
            error: error
        })
    }
}

module.exports = fetchRequests