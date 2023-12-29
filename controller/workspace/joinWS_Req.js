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

const joinWS_Req = async (req, res) => {
    // console.log(req.body)
    const ws_id = req.body.ws_id
    try {
        //! fetching the user details
        //req.user is a part attached at middleware and req.user contains a json within itself
        const UserId = await req.id.user.id
        let user = await USER.findById(UserId)

        //! fetching ws using the ws_id
        let ws = await WORKSPACE.find({ ws_id: ws_id })
        console.log(ws)

        //! Storing WS data ws object
        const owner_email = ws[0].owner_email
        const ws_name = ws[0].project_name

        //! sender email and name
        const name = user.name
        const email = user.email

        //! checking if the request has been already sent
        const request = await REQUEST.findOne({ ws_id: ws_id, from_email: email })
        // console.log(request)
        if (request) {    //? request exists
            // console.log(request.permission)
            if (request.permission) {
                return res.status(200).json({
                    success: true,
                    message: "Your request has been already approved"
                })
            } else {
                return res.status(200).json({
                    success: true,
                    message: "You have already send the request"
                })
            }
        } else {
            // console.log(owner_email,name,email)
            //! Creation of new REQUEST
            const request_2 = await REQUEST.create({
                name: name,
                from_email: email,
                ws_id: ws_id,
                to_email: owner_email,
            })
        }


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mail,
                pass: password, // Use the App Password generated in your Gmail Account settings
            },
        });

        const mailOptions = {
            from: mail,
            to: owner_email,
            subject: `You have Request to Join your Workspace ${ws_name}`,
            html: '<body>' +
                '<div style="background-color: #1d3557; border:2px solid yellow; color: #fffcf2; font-family:Verdana, Geneva, Tahoma, sans-serif; width: 95%; padding:1% ">' +
                '<h1 style="text-align: center;">Kanban Board</h1>' +
                '<h3 style="text-align: center;">We hope this message finds you in good health</h3>' +
                '<p style="text-align: center;">You have a Request from <b><span style="color: #fdca40;">' + name + '</span></b> for joining the <b><span style="color: #fdca40;">' + ws_name + '</span></b> workspace created by you</p>' +
                '<b><p style="text-align: center;">Please Login to your account and review the Request</p></b>' +
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
            message: "Request Sent to the owner Succesfully"
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

module.exports = joinWS_Req