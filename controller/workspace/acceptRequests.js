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

const acceptRequest = async (req, res) => {
    try {
        console.log("hi")
        const r_email = req.body.email;
        const ws_id = req.body.ws_id
        const permission = req.body.permission
        console.log("stagee")

        //! fetching the user details from authtoken processing (ownner of ws)
        //req.user is a part attached at middleware and req.user contains a json within itself
        const id = await req.id.user.id
        let user = await USER.findById(id)

        //! sender email and name
        const owner_name = user.name
        // const owner_email = user.email

        console.log("stagee")
        const request = await REQUEST.findOne({ ws_id: ws_id, from_email: r_email })
        const ws = await WORKSPACE.findOne({ ws_id: ws_id })
        console.log(ws)
        const ws_name = ws.project_name
        const user_obj = await USER.findOne({ email: request.from_email })
        //! count of members
        if (permission) {
            const ws = await WORKSPACE.findOneAndUpdate({ ws_id: ws_id }, { $inc: { countOfMembers: 1 } })
            const new_value = user_obj.joined_WS + "-" + ws_id
            const user = await USER.findOneAndUpdate({
                email: request.from_email
            },
                {
                    $set: {
                        joined_WS: new_value
                    }
                })
        }

        //! updating permission in the request object
        const request_upd = await REQUEST.findOneAndUpdate({ ws_id: ws_id }, { permission: permission })

        //! granted or rejected
        const Status = permission ? "Accepted" : "Rejected"

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dishantshah3133@gmail.com',
                pass: 'tapv nhsh kdci uppe', // Use the App Password generated in your Gmail Account settings
            },
        });

        const mailOptions = {
            from: 'dishantshah3133@gmail.com',
            to: request.from_email,
            subject: `Status of your Request to join ${ws_name}`,
            html: '<body>' +
                '<div style="background-color: #1d3557; border:2px solid yellow; color: #fffcf2; font-family:Verdana, Geneva, Tahoma, sans-serif; width: 95%; padding:1% ">' +
                '<h1 style="text-align: center;">Kanban Board</h1>' +
                '<h3 style="text-align: center;">We hope this message finds you in good health</h3>' +
                '<p style="text-align: center;">Your Request to join <b><span style="color: #fdca40;">' + ws_name + '</span></b> has been <b><span style="color: #fdca40;">' + Status + '</span></b></p>' +
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


        return res.status(200).json({
            success: true,
            message: "Mail sent to the Requestee Successfully"
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

module.exports = acceptRequest