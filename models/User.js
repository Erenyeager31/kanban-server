const mongoose = require('mongoose')

const User_Schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    owned_WS:{
        type:String,
        default:"0"
    },
    joined_WS:{
        type:String,
        default:"0"
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Users',User_Schema)