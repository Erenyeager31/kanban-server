const jwt = require('jsonwebtoken')
const JWT_SECRET = "123#@!wer&45"

const fetchuser = (req, res, next) => {
    try {
        if (!req.headers?.cookie) {
            return res.status(200).json({
                success: false,
                message: "Please login!",
            });
        }

        const token = req.headers?.cookie.split('=')[1]
        // console.log(token)
        const verification = jwt.verify(token, JWT_SECRET)

        if (verification) {
            req.id = verification
            next();
        } else {
            return res.status(200).json({
                success: false,
                message: "Please Login !"
            })
        }
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "Some error Occured",
            "error":error.message
        });
    }
}

module.exports = fetchuser