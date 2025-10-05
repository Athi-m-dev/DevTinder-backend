var jwt = require('jsonwebtoken');
const User = require("../models/User.js")


const authUser = async (req , res , next) => {
    try {
        const {token} = req.cookies
      
        if (!token) {
          throw new Error("Need to login again")
        }
      
        decodedId = jwt.verify(token,"devtinner@321")
        const {_id} = decodedId
        const user = await User.findOne({_id})
      
        if (!user) {
          throw new Error("user not defined")
        }
      
        req.user = user
        next()
    } catch (err) {
        res.send(err.message)
    }
}

module.exports = {authUser}
