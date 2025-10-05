const mongoose = require("mongoose")
const User = require("./User.js")

const ConnectionRequestSchema = new mongoose.Schema({
    fromUserid : {
          type: mongoose.Schema.Types.ObjectId,
          required : true,
          ref : "Users"
    },
    toUserid : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Users"
    },
    status : {
        type : String,
        enum : {
            values : ["ignored","interested", "accepted", "rejected"],
            message : `{VALUE} , "status Incorrect"`
        },
    },
}, 
{ timestamps : true }
);

const ConnectionRequest = mongoose.model("ConnectionRequests" , ConnectionRequestSchema)

module.exports = ConnectionRequest