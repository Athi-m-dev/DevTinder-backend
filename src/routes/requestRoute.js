const express = require("express")
const requestRoute = express.Router()
const ConnectionRequest = require("../models/ConnectionRequest.js")
const {authUser} = require("../middlewares/auth.js")
const User = require("../models/User.js")

requestRoute.post("/request/send/:status/:toUserid" , authUser , async (req , res) => {
        try {
            const fromUserid = req.user._id
            const toUserid = req.params.toUserid
            const status = req.params.status
            
            const AllowedStatus = ["ignored", "interested"]
    
            if(!AllowedStatus.includes(status)) {
              return res.status(400).json({
                message : "status not allowed" + status
              })
            }
    
            const toUser = await User.findById(toUserid)
    
            if (!toUser) {
                return res.status(400).json ({
                    message : "To user not found"
                })
            }

            if (fromUserid == toUserid) {
                res.status(400).send("Cannot send the request yourself")
            }
    
            const existingConnectionrequest = await ConnectionRequest.findOne({
                $or : [
                    {fromUserid , toUserid} ,
                    {fromUserid : toUserid , toUserid : fromUserid}
                ]
            })
    
            if (existingConnectionrequest) {
                res.status(400).json({
                    message : "Cannot make the request again"
                })
            }
              
            const connectionrequests = await new ConnectionRequest({
                fromUserid , 
                toUserid , 
                status
            })

            const data = await connectionrequests.save()
    
            res.json({
                message : `${req.user.name} send request to ${toUser.name}`, 
                data
            })
        } catch (err) {
            res.send(err.message)
        }
       
});


requestRoute.post("/request/review/:status/:requestId" , authUser , async(req , res) => {
       try {
        const {status , requestId} = req.params
        const loggedInUser = req.user._id
 
        const AllowedStatus = ["accepted" , "rejected"]
 
        if (!AllowedStatus.includes(status)) {
         return res.status(400).json({
             message : "Status not found"
         })
        }
 
        const connectionrequests = await ConnectionRequest.findOne({
         _id : requestId,
         toUserid : loggedInUser,
         status : "interested"
        })
        console.log(connectionrequests)
 
        if (!connectionrequests) {
         return res.status(400).json({
             message : "Cannot able to make the connection request"
         })
        }

        connectionrequests.status = status;
        const data = await connectionrequests.save()
 
        res.json({
         message : "Request " + status ,
         data,
        })
       } catch (err) {
         res.send(err.message)
       }
})

module.exports = requestRoute



