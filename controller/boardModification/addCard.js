const USER = require('../../models/User')
const WS = require('../../models/Workspace')
const TASKS = require('../../models/Tasks')
const TESTING = require('../../models/Testing')
const UNDERWORK = require('../../models/Underwork')
const DEPLOYED = require('../../models/Deployed')
const COMPLETED = require('../../models/Completed')

const generateCardID = async (cat_obj, category, ws_id, user, title, content) => {
    const data = await cat_obj.find({
        ws_id: ws_id,
    })
    //! card_ID format --> username - <id+1> - category
    if (data.length == 0) { //* no entries made yet
        card_id = user.name + "-" + 0 + "-" + category
    } else { //* entries exist in the model
        const length = data.length
        const prev_id = parseInt(data[length - 1].card_id.split("-")[1])
        card_id = user.name + "-" + (prev_id + 1) + "-" + category
    }

    //* use the card_id and create a new document
    let obj = await cat_obj.create({
        ws_id: ws_id,
        title: title,
        content: content,
        added_by: user.name,
        card_id: card_id
    })

    return obj;
}

const addCard = async (req, res) => {
    try {
        //* destructuring the req.body
        const { ws_id, category, title, content } = req.body

        if(!(ws_id && category && title && content)){
            return res.status(200).json({
                success:false,
                message:"Unable to add card"
            })
        }
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

        //* determining the category
        try {
            let card_id = ''

            switch (category) {
                case 'tasks':
                    const tasks_obj = generateCardID(TASKS, category, ws_id, user, title, content)
                    if (tasks_obj) {
                        return res.status(200).json({
                            success: true,
                            message: "Added successfully"
                        })
                    }
                    break;
                case 'completed':
                    const completed_obj = generateCardID(COMPLETED, category, ws_id, user, title, content)
                    if (completed_obj) {
                        return res.status(200).json({
                            success: true,
                            message: "Added successfully"
                        })
                    }
                    break;
                case 'underwork':
                    const underwork_obj = generateCardID(UNDERWORK, category, ws_id, user, title, content)
                    if (underwork_obj) {
                        return res.status(200).json({
                            success: true,
                            message: "Added successfully"
                        })
                    }
                    break;
                case 'testing':
                    const testing_obj = generateCardID(TESTING, category, ws_id, user, title, content)
                    if (testing_obj) {
                        return res.status(200).json({
                            success: true,
                            message: "Added successfully"
                        })
                    }
                    break;
                case 'deployed':
                    const deployed_obj = generateCardID(DEPLOYED, category, ws_id, user, title, content)
                    if (deployed_obj) {
                        return res.status(200).json({
                            success: true,
                            message: "Added successfully"
                        })
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            return res.status(200).json({
                success: false,
                message: "Unable to add the card, please try again later",
                error: error.message
            })
        }

        //* fetching data for the creation of card_ID
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "Some error occured, please try again later"
        })
    }
}

module.exports = addCard