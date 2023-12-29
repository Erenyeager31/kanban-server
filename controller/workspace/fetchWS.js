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

const fetchWS = async (req, res) => {
    try {
        //! fetching the user details from authtoken processing (ownner of ws)
        //req.user is a part attached at middleware and req.user contains a json within itself
        const id = await req.id.user.id
        // console.log(req.id)
        let user = await USER.findById(id)
        // console.log(user.joined_WS)
        // console.log(user)

        const joined_ws_id = user.joined_WS.split('-')
        joined_ws_id.shift()
        // console.log(joined_ws_id)
        const owned_ws_id = user.owned_WS.split('-')
        owned_ws_id.shift()

        const j_workspace = await WORKSPACE.find({ ws_id: { "$in": joined_ws_id } })
        const o_workspace = await WORKSPACE.find({ ws_id: { "$in": owned_ws_id } })
        // console.log(j_workspace)

        return res.status(200).json({
            success: true,
            message: "Workspace fetched successfully",
            workspace: { j_workspace, o_workspace }
        })
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Some error Occured, please try again later 🙏",
            error: error.message
        })
    }
}

module.exports = fetchWS