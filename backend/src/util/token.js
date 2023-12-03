const jwt=require("jsonwebtoken")
require("dotenv").config()

module.exports=(user)=>{
    return jwt.sign({user:user},process.env.PRIVATE_KEY)

}