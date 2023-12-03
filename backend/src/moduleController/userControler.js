
const express =require("express")
const router=express.Router()
const User=require("..//module/user")
require("dotenv").config()
const {body,validationResult}=require("express-validator")

const emailChain=()=>body("email").isEmail().notEmpty().withMessage("Email is required")
const passwordChain=()=>body("password").notEmpty().isLength({min:5}).withMessage('Password is required')
const nameChain=()=>body("name").notEmpty().withMessage('Name is required')
const formatOfError=require("..//util/valadation")
const SentMail=require("..//util/SentMail")
const OtpVerification=require("..//module/otpVerification")
const bcrypt=require("bcrypt")
const passport=require("..//config/passport")

passport.serializeUser(function ({user,token},done){
    done(null,{user,token})
})
passport.deserializeUser(function ({user,token},done){
    done(null,{user,token})

})




router.post("/register",nameChain(),emailChain(),passwordChain(),async (req,res)=>{
    try{
        const error=validationResult(req)
        if(!error.isEmpty()){
            return res.status(400).send(formatOfError(error.array()).join(","))
        }
        let user=await User.findOne({email:req.body.email}).lean().exec()
        if(user){
            return res.status(400).send("User already registered")
        }
        user=await User.create(req.body)

        return res.status(200).send(user)

    }
    catch(err){
        
        return res.status(400).send("error occurred")
    }
})

router.post("/login",emailChain(),async (req,res)=>{
    try{
        const error=validationResult(req)
        if(!error.isEmpty()){
            return res.status(400).send(formatOfError(error.array()).join(","))
        }

        let user=await User.findOne({email:req.body.email})
        if(!user){
            return res.status(400).send("Email does not exist")
        }
        const matchPassword=user.checkPassword(req.body.password)
        if(!matchPassword){
            return res.status(400).send("Password does not match")
        }
        const sendData=await SentMail(user.email)
        return res.status(200).send(sendData)


    }
    catch(err){
        return res.status(400).send("error occurred")
    }
})

router.post("/otpverification/:id",async (req,res)=>{
    try{

        const id=req.params.id
        
        const {otp}=req.body
        if(!id || !otp){
            return res.status(400).send("please enter a otp")
        }

        const otpData=await OtpVerification.find({userId:id}).lean().exec()
        // console.log(otpData)
        
        if(otpData.length==0){
            return res.status(400).send("user not found")
        }
        const hashOtp=otpData[0]?.otp
        const expiredAt=otpData[0]?.expiredAt
        // console.log(expiredAt,new Date())
        if(expiredAt < new Date()){
            await OtpVerification.deleteMany({userId:id})
            return res.status(400).send("otp expired")
        }
        else{
            const compareOtp=bcrypt.compareSync(otp,hashOtp)
            if(!compareOtp){
                return res.status(400).send("You otp is incorrect")
            }
            else{
                await OtpVerification.deleteMany({userId:id})
                await User.findByIdAndUpdate(id,{verified:true})

                return res.status(200).send({status:"your otp has verified"})
            }
        }
       

    }
    catch(err){
        // console.log(err)
        return res.status(400).send("error occurred")
    }
} )

router.post("/resendOtp/:id",async (req, res) => {
    try{
        const id=req?.params?.id
        const user=await User.findById(id).lean().exec()
        const sendData=await SentMail(user?.email)

        return res.status(200).send(sendData)


    }
    catch(err){
        return res.status(400).send("error occurred")
    }
})

router.post("/forgetPassword",async (req,res)=>{
    try{
        const {email}=req.body
        const user=await User.findOne({email: email}).lean().exec()
        if(!user){
            return res.status(400).send("Email doesn't exist")
        }
        const sendData=await SentMail(user?.email)

        return res.status(200).send(sendData)

    }
    catch(err){
        return res.status(400).send("error occurred")
    }
})

router.patch("/resetPassword/:id",async (req,res)=>{
    try{
        const id=req.params.id
        const {resetPassword}=req.body
        const hashPassword=bcrypt.hashSync(resetPassword,8)
        const user=await User.findByIdAndUpdate(id,{password:hashPassword})
        return res.status(200).send({status:"your password has been updated"})

    }
    catch(err){
        return res.status(400).send("error occurred")
    }
})

router.get('/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    const {user,token} = req.user
    // Successful authentication, redirect home.
    return res.status(200).send({user,token});
  });
module.exports=router