const mongoose = require('mongoose')

const deployedSchema =new mongoose.Schema({
    ws_id:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    added_by:{
        type:String,
        required:true
    },
    modified_by:{
        type:String,
        default:""
    },
    card_id:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('deployed',deployedSchema)