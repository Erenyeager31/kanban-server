require('dotenv').config()
const mongoose = require('mongoose')
// const mongoURI = 'mongodb://localhost:27017/Kannban_Board'
const mongoURI = process.env.mongoCluster_url

const connectToMongo = () => {
    mongoose.connect(mongoURI)
}

module.exports = connectToMongo;