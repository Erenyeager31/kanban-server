const USER = require('../../models/User')
const WS = require('../../models/Workspace')
const TASKS = require('../../models/Tasks')
const TESTING = require('../../models/Testing')
const UNDERWORK = require('../../models/Underwork')
const DEPLOYED = require('../../models/Deployed')
const COMPLETED = require('../../models/Completed')

const category_models = {
    "tasks": TASKS,
    "underwork": UNDERWORK,
    "completed": COMPLETED,
    "testing": TESTING,
    "deployed": DEPLOYED
}

const fetchMultiple = async (req,res) =>{
    try {
        const {ws_id,category} = req.body
    
        let cards = {}
        let data = ""
        for(let i in category){
            // console.log(category[i])
            data = await category_models[category[i]].find({
                ws_id:ws_id
            })
            cards[category[i]] = data
        }
        return res.status(200).json({
            success:true,
            cards
        })
    } catch (error) {
        return res.status(200).json({
            success:false,
            message:"Unable to fetch the data"
        })
    }
}

module.exports = fetchMultiple