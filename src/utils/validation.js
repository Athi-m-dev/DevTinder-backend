
validateSignup = (req) => {
   const {name , email , password} = req.body;
   if (!name || !email || !password) {
       return { status: false, message: "Name, email, password, and age are required." };
   }
   else if (email.length < 5 || !email.includes("@gmail.com")) {
         return { status: false, message: "Invalid email format." };
   }
   return { status: true };
}

validateUserdata = (req)=> {
   const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((feild) => allowedEditFields.includes(feild))

  return isEditAllowed
}

module.exports = {
    validateSignup,
    validateUserdata
}