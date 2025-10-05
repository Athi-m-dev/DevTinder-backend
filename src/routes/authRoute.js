const express = require("express")
const authRoute = express.Router()
const User = require("../models/User.js")
const bcrypt = require('bcrypt');
const {validateSignup} = require("../utils/validation.js");
const { authUser } = require("../middlewares/auth.js");

authRoute.post("/login" , async(req , res) => {
  try {
    const {email , password} = req.body;
    const user  = await User.findOne({email})
    if (!user) {
      res.send("Invalid Credintails");
    }

    const pass = await user.validatePassword(password)
    if (!pass) {
      res.send("Invalid Credintials")
    } 

    else {
      const token = await user.getjwt()

      res.cookie("token" , token)
      res.send("User login succesfully")
    }
  } catch (err) {
    res.send(err.message)
  }
})

authRoute.post("/signup", async(req , res) => {
  try {
    const {name , email , password } = req.body;

    validateSignup(req);

    const hashpassword = await bcrypt.hash(password, 10); // salt rounds
        
    const newUser = new User({
      name: name,
      email: email,
      password: hashpassword,
    })

    await newUser.save()
    console.log ("new user added successfully")
    res.send("user signed up successfully")
  }
  catch (error) {
   res.status(500).send(error.message)
  }
}) 

authRoute.post("/logout" , authUser , async (req, res)=> {
   try {
    const user = req.user
    res.cookie("token", null, { expires: new Date(Date.now())})
    res.send(`${user.name} you logout successfully `)
   } catch (err) {
    res.send("cannot logout")
   }
})

module.exports =  authRoute
