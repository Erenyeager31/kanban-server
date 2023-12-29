const mongoose = require('mongoose')

const Workspace_Schema = new mongoose.Schema({
    project_name:{
        type:String,
        required:true
    },
    ws_id:{
        type:String,    //* rev.string+docinstring
        required:true
    },
    doc:{
        type:Date,
        default:Date.now
    },
    countOfMembers:{
        type:Number,
        default:1
    },
    owner_email:{
        type:String,
        required:true
    },
    leader_name:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Workspace',Workspace_Schema)