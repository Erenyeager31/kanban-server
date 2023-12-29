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

const createWS = async (req, res) => {
    //! Storing the validation results
    const errors = validationResult(req)

    //! Sending the errors to the client
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()
        })
    }

    const project_name = req.body.project_name
    try {
        //! fetching the user details
        //req.user is a part attached at middleware and req.user contains a json within itself
        const UserId = await req.id.user.id
        let user = await USER.findById(UserId)

        //! Checking if the workspace of same name already exists by the means of email
        // let ws = await WORKSPACE.findOne({project_name:project_name,owner_email:user.email})
        let ws = await WORKSPACE.find({ owner_email: user.email })
        // console.log("ws :",ws)

        //* case when the project name is entered with or without space
        //? The code below ensures :
        //? no same project_name with or without space
        //? no same project_name with different case(A / a)
        //? or the combination of both above cases
        for (i in ws) {
            // console.log(ws[i].project_name)
            if (ws[i].project_name.split(' ').join('').toLowerCase() ===
                project_name.split(' ').join('').toLowerCase()) {
                return res.status(400).json({
                    success: false,
                    message: "A workspace already exists with same Project Name, please choose a new Name"
                })
            }
        }

        let date = new Date()
        date = String(date)
        date = date[4] + "" + date.substring(8, 10) + "" + date.substring(11, 15)
        console.log(date)

        let rev_string = project_name.split('').reverse().join('')
        rev_string = rev_string.split(' ').join('')
        const ws_id = rev_string + "" + date + "" + user.name[0]
        console.log(ws_id)

        const new_ws = ws_id
        //! Creation of new Workspace
        ws = await WORKSPACE.create({
            project_name: project_name,
            ws_id: ws_id,
            owner_email: user.email,
            leader_name: user.name
        })

        // console.log(user)
        const new_value = user.owned_WS + "-" + ws_id
        const user_update = await USER.findOneAndUpdate(
            {
                email: user.email
            },
            {
                $set: {
                    owned_WS: new_value
                }
            })

        return res.status(200).json({
            success: true,
            message: "Workspace created Succesfully"
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

module.exports = createWS