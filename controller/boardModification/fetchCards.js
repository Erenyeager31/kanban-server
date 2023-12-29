const USER = require('../../models/User')
const WS = require('../../models/Workspace')
const TASKS = require('../../models/Tasks')
const TESTING = require('../../models/Testing')
const UNDERWORK = require('../../models/Underwork')
const DEPLOYED = require('../../models/Deployed')
const COMPLETED = require('../../models/Completed')

const fetchCards = async (req,res) =>{
    //* after verification through middleware, userID can be obtained along with ws_id from req.body
    try {
        const UserID = req.id.user.id
        const user = await USER.findById(UserID)
    
        console.log(req.body)
        const {ws_id} = req.body
        console.log("hey",ws_id)
    
        const tasks = await TASKS.find({ws_id:ws_id})
        const underwork = await UNDERWORK.find({ws_id:ws_id})
        const completed = await COMPLETED.find({ws_id:ws_id})
        const testing = await TESTING.find({ws_id:ws_id})
        const deployed = await DEPLOYED.find({ws_id:ws_id})
    
        return res.status(200).json({
            success: true,
            message: "Added successfully",
            data:{tasks,underwork,completed,testing,deployed}
        })
    } catch (error) {
        return res.status(200).json({
            success:false,
            message:"Some error occured, please try again later",
            error:error.message
        })
    }
}

module.exports = fetchCards