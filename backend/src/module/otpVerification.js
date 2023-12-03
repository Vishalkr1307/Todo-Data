const mongoose=require("mongoose")

const otpVerification=new mongoose.Schema({
    userId:{type:String, required:true},
    otp:{type:String, required:true},
    createdAt:Date,
    expiredAt:Date,
})

module.exports=mongoose.model("otp",otpVerification)