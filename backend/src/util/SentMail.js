const nodemailer=require("nodemailer")
require("dotenv").config()
const User=require("..//module/user")
const OtpVerification=require("..//module/otpVerification")
const bcrypt=require("bcrypt")
const mailgen=require("mailgen")


module.exports=async (email)=>{
    const transporter=await nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.GMAIL_EMAIL,
            pass:process.env.GMAIL_PASSWORD

        }
    })

    const otp=Math.round(1000+Math.random()*9000).toString()
    const hashOtp=bcrypt.hashSync(otp,8)

    const user=await User.findOne({email:email}).lean().exec()
    if(!user){
        return "user not found"
    }

    const otpVerificatonData=await OtpVerification({
        userId:user._id,
        otp:hashOtp,
        createdAt:new Date(),
        expiredAt:new Date().getTime() + 60*60*5*1000

    })

    await otpVerificatonData.save()

    const mailGenerator=new mailgen({
        theme:'default',
        product:{
            name:'Todo-Item',
            link:'http://localhost:2345'
        }
    })

    var email = {
        body: {
            name: user?.name,
            intro: 'Welcome to Todo-Item! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with Todo, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: otp,
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    const emailBody=mailGenerator.generate(email)
    const emailText=mailGenerator.generatePlaintext(email)

    const info=await transporter.sendMail({
        from:process.env.GMAIL_EMAIL,
        to:user?.email,
        subject:'Otp verification',
        html:emailBody,
        text:emailText

    })
    
    return {status:`otp successfully sent to email ${user?.email} `,email:user?.email,userId:user._id}

}