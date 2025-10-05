const express = require("express")
const profileRoute = express.Router()
const { authUser } = require("../middlewares/auth.js")
const { validateSignup } = require("../utils/validation.js")
const User = require("../models/User.js")
const bcrypt = require('bcrypt');



profileRoute.post("/profile" , authUser , async (req , res)=> {
    const user = req.user
    res.send(user)
})


profileRoute.patch("/profile/edit", authUser , async (req, res) => {
  try {
    if(!validateUserdata(req)) {
      throw new Error("Invalid Credentials")
    }

    loggedInuser = req.user

    Object.keys(req.body).every((key) => loggedInuser[key] = req.body[key])

    await loggedInuser.save()

    res.json({
      message : `${loggedInuser.name} , "Your profile edited successfully`,
      data : loggedInuser
    })

  } catch (err) {
    res.send(err.message)
  }    
});

profileRoute.patch("/profile/changepassword" , async(req , res) => {
    const {email , password} = req.body
     
    try {
      if(!validateSignup(req)) {
        throw new Error ("Invalid Credintials")
      }
  
      const user = await User.findOne({email})
      console.log(user)
  
      if (!user) {
        throw new Error("Invalid Credintials")
      }
  
      const hashpassword = await bcrypt.hash(password, 10);
  
      user.password = hashpassword
  
      await user.save()

      res.json({
        name : user.name , 
        message : "Your password changed successfully"})

    } catch (err) {
      console.log(err.message)
    }
})

module.exports = profileRoute