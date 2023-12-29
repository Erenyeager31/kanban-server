const express = require('express')
const bmRouter = express.Router()
const verifyUser = require('../middleware/fetch_User')
const addCard = require('../controller/boardModification/addCard')
const modifyCard = require('../controller/boardModification/modifyCard')
const fetchCards = require('../controller/boardModification/fetchCards')
const deleteCard = require('../controller/boardModification/deleteCard')
const fetchMultiple = require('../controller/boardModification/fetchMultiple')

bmRouter.post('/addCard', verifyUser,addCard)
bmRouter.post('/modifyCard', verifyUser, modifyCard )
bmRouter.post('/fetchCards',verifyUser,fetchCards)
bmRouter.post('/deleteCard',verifyUser,deleteCard)
bmRouter.post('/fetchMultipleCards',verifyUser,fetchMultiple)


module.exports = bmRouter