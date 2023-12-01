const mongoose=require("mongoose")

require("dotenv").config()

module.exports=()=>{
    return mongoose.connect(process.env.DB).then(()=>console.log("Connect success to database")).catch(()=>console.log("connect failure"))
}