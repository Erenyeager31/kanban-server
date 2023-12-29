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

const modifyContent = async (cat_obj, ws_id, card_id, user, title, content,res) => {
    try {
        const data = await cat_obj.findOneAndUpdate(
            {
                ws_id: ws_id,
                card_id: card_id
            },
            {
                $set: {
                    title: title,
                    content: content,
                    modified_by: user.name
                }
            }
        )
        console.log(data)
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "Unable to modify,please try again"
        })
    }
    return res.status(200).json({
        success: true,
        message: "Modified successfully"
    })
}

//? obj1 --> old category, obj2 --> new category
const modifyCategory = async (cat_obj1, cat_obj2, ws_id, category, card_id, user, title, content,res) => {
    //* find the existing card from the database
    try {
        const prev_card = await cat_obj1.findOne({
            ws_id: ws_id,
            card_id: card_id
        })
    
        const all_cards = await cat_obj2.find({
            ws_id:ws_id
        })
        console.log(all_cards)
        const length = all_cards.length
    
        //* create a new card ID
        //? the new card if will consist of --> username of og creator + (id + 1) + new category
        let new_card_id = ""
        if(length == 0){
            new_card_id = prev_card.added_by+"-"+0+"-"+category
        }else{
            new_card_id = prev_card.added_by+"-"+all_cards[length-1].card_id.split("-")[1]+"-"+category
        }
    
        //* deleting the old card
        await cat_obj1.deleteOne({
            ws_id: ws_id,
            card_id: card_id
        })
    
        //* create a new card in new category
        const new_card = await cat_obj2.create({
            ws_id: ws_id,
            title: prev_card.title,
            content: prev_card.content,
            added_by: prev_card.added_by,
            modified_by: user.name,
            card_id:new_card_id
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "Unable to modify,please try again"
        })
    }
    
    return res.status(200).json({
        success: true,
        message: "Added Succesfully"
    })
}


const modifyCard = async (req, res) => {
    try {
        //* destructuring the req.body
        const { ws_id, category, card_id, title, content } = req.body
        console.log(req.body)
        //* fetch the id attached by the middleware
        const UserId = await req.id.user.id

        let user = ''
        try {
            //* fetch the user details
            user = await USER.findById(UserId)
        } catch (error) {
            return res.status(200).json({
                success: false,
                message: "Some error occured, please try again later"
            })
        }

        //* comparing the category from card_id to the category parameter to check the kind of modification
        //? 1--> if equal then, there is only change in the title,content
        //? 2--> if not equal, then there is no change in the title,content and only the category
        console.log(category,card_id.split("-")[2])
        if (category === card_id.split("-")[2]) { //? change in the content(modification)
            console.log("inside")
            modifyContent(category_models[category], ws_id, card_id, user, title, content,res)
        } else {
            //? change in category
            //? category --> new category, split syntax --> old category
            modifyCategory(category_models[card_id.split("-")[2]], category_models[category], ws_id, category, card_id, user, title, content,res)
            
            // if (obj) {
            //     console.log("yeh dekho :",obj)
            //     return res.status(200).json({
            //         success: true,
            //         message: "Added successfully"
            //     })
            // }else{
            //     return res.status(200).json({
            //         success: false,
            //         message: "Unable to modify, please try again later"
            //     })
            // }
        }

        //* fetching data for the creation of card_ID
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "Some error occured, please try again later",
            error: error.message
        })
    }
}

module.exports = modifyCard