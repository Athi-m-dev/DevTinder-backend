const express = require("express")
const app = express()
const connectDB = require("./src/config/database.js")
const cookieParser = require("cookie-parser");

app.use(express.json())
app.use(cookieParser());

const authRoute = require("./src/routes/authRoute.js")
const profileRoute = require("./src/routes/profileRoute.js")
const requestRoute = require("./src/routes/requestRoute.js")    
const userRoute = require("./src/routes/userRoute.js")


app.use("/" , authRoute)
app.use("/" , profileRoute)
app.use("/" , requestRoute)
app.use("/" , userRoute)

connectDB().then(()=> {
    console.log ("connect to the database successfully")
    app.listen(9000 , () => {   
    console.log ("server listen on the port" )
  });
});






/* 
  what is middleware's the callback function
  Middleware's  is a callback function that has access to the request object (req), the response object (res), and the next() middleware function in the application’s request-response cycle. It can perform operations such as modifying the request and response objects, ending the request-response cycle, and calling the next middleware function in the stack.

  what is request handlers
  request handlers are the actual response functions that handle incoming requests and send responses back to the client.
  which callback use the res.send they are they are the request handlers
*/