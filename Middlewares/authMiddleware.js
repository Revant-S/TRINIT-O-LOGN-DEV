const jwt = require("jsonwebtoken")
const authControllers = require("../Controllers/authControllers")
const cookies = require("cookie-parser")

const requireAuth = (req,res,next)=>{
  const UserJwt = req.cookies.jwt;
  
    if (!UserJwt) {
        res.json({msg : "User Jwt Not Found"})  ;
        return;
    }
    try {
        jwt.verify(UserJwt,authControllers.secret)
        next()
      } catch (error) {
        res.json({error : error.ReferenceError})
    }

}

module.exports = requireAuth