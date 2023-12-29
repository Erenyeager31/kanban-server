const express = require('express')
const wsRouter = express.Router()
// const bcrypt = require('bcryptjs')
// var jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const nodemailer = require('nodemailer')

//?Importing the models for db
// const USER = require('../models/User')
// const WORKSPACE = require('../models/Workspace')
// const REQUEST = require('../models/Requests')

//? importing middleware
const fetchuser = require('../middleware/fetch_User')
const createWS = require('../controller/workspace/createWS')
const joinWS_Req = require('../controller/workspace/joinWS_Req')
const fetchRequests = require('../controller/workspace/fetchRequests')
const acceptRequest = require('../controller/workspace/acceptRequests')
const fetchSearch = require('../controller/workspace/fetchSearch')
const fetchWS = require('../controller/workspace/fetchWS')

//? smtp
// const mail = process.env.mail
// const password = process.env.password

// const JWT_SECRET = process.env.JWT_SECRET

wsRouter.post('/createWS',fetchuser,[
    //! Section to validate the data in the request
    body('project_name', 'Project Name cannot be empty').exists()
], createWS)

wsRouter.post('/joinwsReq', fetchuser, joinWS_Req)

wsRouter.post('/fetchRequests',fetchuser, fetchRequests)

wsRouter.post('/acceptRequest',fetchuser, acceptRequest)

wsRouter.post('/fetchWS',fetchuser, fetchWS)

wsRouter.post('/fetchSearch',fetchuser, fetchSearch)

module.exports = wsRouter