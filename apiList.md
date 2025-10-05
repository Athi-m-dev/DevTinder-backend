# DevTinder APIs

 ## authRouter
    POST /signup - finished
    POST /login -  finished
    POST /logout - finished

## profileRouter
    GET /profile/view - finished
    PATCH /profile/edit  - pending and work should write the api for forgot the password
    PATCH /profile/password // Forgot password API

## connectionRequestRouter
    POST /request/send/:status/:userId
    POST /request/review/:status/:requestId
    
## userRouter
    GET /user/requests/received
    GET /user/connections
    GET /user/feed - Gets you the profiles of other users on platform
Status: ignored, interested, accepeted, rejected