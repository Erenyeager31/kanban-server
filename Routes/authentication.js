const express = require('express')
const authRouter = express.Router()
const { body, validationResult } = require('express-validator')

//?Importing the models for db
const fetchuser = require('../middleware/fetch_User')
const cache = require('node-cache')
const createUser = require('../controller/auth/createUser')
const loginUser = require('../controller/auth/loginUser')
const fetch_user = require('../controller/auth/fetchuser')
const sendOTP = require('../controller/auth/sendOTP')
const verifyOTP = require('../controller/auth/verifyOTP')

const mail = process.env.mail
const password = process.env.password

const JWT_SECRET = process.env.JWT_SECRET

authRouter.post('/createUser',[
    //! Section to validate the data in the request
    body('name', 'Name field cannot be Empty').exists(),
    body('email', 'Enter a valid email value').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 4 })
], createUser)

authRouter.post('/loginUser',[
    //! Section to validate the data in the request
    body('email', 'Enter a valid email value').isEmail(),
    body('password', 'Enter a valid password').exists()
], loginUser)

authRouter.post('/fetchUser',fetchuser, fetch_user)

authRouter.post('/sendOTP',[
    body('email', 'Enter a valid email value').isEmail(),
],sendOTP)

authRouter.post('/verifyOTP',[
    body('email', 'Enter a valid email value').isEmail(),
],verifyOTP)

module.exports = authRouter