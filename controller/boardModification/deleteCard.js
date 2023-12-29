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

const deleteCard = async (req,res) =>{
    try {
        const UserID = req.id.user.id
        const user = await USER.findById(UserID)
    
        const {ws_id,category,card_id} = req.body

        const card = await category_models[category].findOne({
            ws_id:ws_id,
            card_id:card_id
        })

        if(card.added_by === user.name){
            const result = await category_models[category].findOneAndDelete({
                ws_id:ws_id,
                card_id:card_id
            })
            if(result){
                return res.status(200).json({
                    success:true,
                    message:"Card deleted succesfully"
                })
            }
        }else{
            return res.status(200).json({
                success:false,
                message:"Only the creator of card can delete it !"
            })
        }
        // const card = await category_models[category].findOneAndDelete({
        //     ws_id:ws_id,
        //     card_id:card_id
        // })
    } catch (error) {
        return res.status(200).json({
            success:false,
            message:"Some error occured please try again later"
        })        
    }


}

module.exports = deleteCard