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

const fetchSearch = async (req, res) => {
    try {
        const id = req.query
        console.log(id)
        const { query } = req.body

        //! fetching the user
        const UserId = await req.id.user.id
        // console.log(req.id)
        let user = await USER.findById(UserId)


        if (id.id === '1') {
            //! name
            const result = await WORKSPACE.find({
                project_name:
                    { $regex: new RegExp(query, 'i') },
                owner_email:
                    //! ne -> not equal
                    { $ne: user.email }
            })

            if (!result.length) {
                return res.status(200).json({
                    success: false,
                    message: `No Workspace found with the query ${query}`
                })
            }
            return res.status(200).json({
                success: true,
                result
            })
        } else if (id.id === '2') {
            const result = await WORKSPACE.find({
                ws_id: query
            })
            if (!result.length) {
                return res.status(200).json({
                    success: false,
                    message: `No Workspace found with the query ${query}`
                })
            }
            return res.status(200).json({
                message: "hi",
                id,
                result
            })
        }
    } catch (error) {
        return res.status(200).json({
            message: "hi",
            error: error.message
        })
    }
}

module.exports = fetchSearch