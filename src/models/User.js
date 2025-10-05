var validator = require('validator');
const mongoose = require("mongoose")
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique : true,
        trim : true,
        lowercase : true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        min : 6,
        max :15,
        validate(value) {
           if (!validator.isStrongPassword(value)) {
               throw new Error("Weak password");
           }
        }
    },
    age: {
        type: Number,
        min : 18
    },
    PhotoUrl : {
        type: String,
        default : "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"
    },
    gender : {
        type: String,
        validate (value) {
            const allowedGenders = ["male", "female", "other"];
            if (!allowedGenders.includes(value)) {
                throw new Error ("Invalid gender")
            }
        }
    },
    skills : {
        type: [String],
        default : [],
         validate: {
         validator: function (value) {
            return Array.isArray(value) && value.every(v => typeof v === "string" && v.trim() !== "" && v.length <= 20);
        },
        message: "Skills must be an array of non-empty strings"
    }
    
    },
    about : {
        type: String,
        max : 100,
        default : "you can add about yourself here"
    }
    
}, { timestamps: true });


userSchema.methods.getjwt = async function () {
    try {
        const user = this
        const token =  jwt.sign({ _id: user._id.toString()}, "devtinner@321" , { expiresIn: '7d' });
        if (!token) {
            throw new Error ("Token not found")
        }
        else {
            return token
        }
    } catch (err) {
        throw new Error(err.message)
    } 
}


userSchema.methods.validatePassword = async function (passwordbyUser)  {
     const user = this
     isValidPassword = await bcrypt.compare(passwordbyUser,user.password)
     try {
        if (!isValidPassword) {
           throw new Error("Password not found")
        }
        else {
           return isValidPassword
        }
     } catch (err) {
        throw new Error(err.meassage)
     }
}

const User = mongoose.model("Users", userSchema);
module.exports = User;