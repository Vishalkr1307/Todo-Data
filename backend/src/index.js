const express=require("express")
const app = express()
const User=require("./moduleController/userControler")
const Task=require("./moduleController/taskControl")
const session = require('express-session')
app.use(express.json())
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use("/auth",User)
app.use("/task",Task)




module.exports=app