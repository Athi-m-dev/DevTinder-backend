const express = require("express")
const userRoute = express.Router()
const {authUser} = require("../middlewares/auth.js")
const ConnectionRequest = require("../models/ConnectionRequest.js")
const { set } = require("mongoose")
const User = require("../models/User.js")
const USER_SAFE_DATA = "name photoUrl age gender about skills";

userRoute.get("/user/requests/received", authUser , async(req , res) => {
     try {
        const loggedInUser = req.user._id
   
        const data = await ConnectionRequest.find({
           toUserid : loggedInUser,
           status : "interested"
        }).populate("fromUserid", "name skills about") 
          .populate("toUserid", "name skills about");
   
        res.json({
           message : "requests received" , 
           data,
        })
     } catch (err) {
        res.send(err.message)
     }
})


userRoute.get("/user/connections" , authUser , async (req , res) => {
    try {
        const loggedInUser = req.user
        const connectionrequests = await ConnectionRequest.find({
            $or: [
                {toUserid : loggedInUser._id , status : "accepted"},
                {fromUserid : loggedInUser._id , status : "accepted"}
            ]
        }).populate("fromUserid" , "name ,  about").populate("toUserid" , "name , about")

        const data = connectionrequests.map((row) => {
        if (row.fromUserid._id.toString() === loggedInUser._id.toString()) {
            return row.toUserid;
        }
        return row.fromUserid;
        });

        return res.json({
            data,
        })

    } catch (err) {
        return res.status(400).json({
            message : err.message
        })
    }
})
userRoute.get("/user/feed" , authUser , async(req , res) => {
   try {    
    let page = parseInt(req.query.page || 1)
    let limit = parseInt(req.query.limit || 10)
    const skip = (page -1) * limit
    limit = limit > 50 ? 50 : limit
    page 

    const loggedInUser = req.user._id;
    const connectionrequests = await ConnectionRequest.find({
     $or : [
         {fromUserid : loggedInUser},
         {toUserid : loggedInUser}
     ]
    }).select("fromUserid toUserid")

    const hidefromfeed = new Set()
    connectionrequests.forEach((res) => {
         hidefromfeed.add(res.fromUserid.toString());
         hidefromfeed.add(res.toUserid.toString());
    })
 
    const users = await User.find({
        $and : [
            { _id : {$nin : Array.from(hidefromfeed)}},
            { _id : {$ne : loggedInUser}} 
        ]
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit)

    res.json({
       users
    })

   } catch (err) {
      res.status(400).json({
        message : err.message
      })
   }
})


module.exports = userRoute