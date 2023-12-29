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

const fetch_user = async (req, res) => {
    try {
        const id = await req.id.user.id
        let user = await USER.findById(id)

        return res.status(200).json({
            success: true,
            name: user.name,
            email: user.email,
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Some error has occured, please try again later 🙏"
        })
    }
}

module.exports = fetch_user