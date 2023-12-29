const mongoose = require('mongoose')

const Request_Schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    from_email:{
        type:String,
        required:true
    },
    ws_id:{
        type:String,
        required:true
    },
    to_email:{
        type:String,
        required:true
    },
    permission:{
        type:Boolean,
        default:false
    },
    DOR:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Requests',Request_Schema)