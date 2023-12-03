const express=require("express")
const router=express.Router()
const Task=require("..//module/task")
const {body,validationResult}=require("express-validator")
const formatOfError=require("..//util/valadation")

const titleChain=()=>body("title").notEmpty().isString().withMessage("title  not be empty") 
const descriptionChain=()=>body("description").notEmpty().isString().withMessage("description not be empty")
const tasksStatusChain=()=>body("tasks_status").notEmpty().isString().withMessage("task_status not be empty")
const authentication=require("..//middleware/authonciate")



router.post("/addTask",titleChain(),descriptionChain(),tasksStatusChain(),async (req,res)=>{
    try{

        const error=validationResult(req)
        if(!error.isEmpty()){
            return res.status(400).send(formatOfError(error.array()).join(","))
        }

        const task=await Task.create(req.body)
        return res.status(200).send(task)

    }
    catch(err){
        // console.log(err)
        return res.status(400).send("bad request occurred")
    }
})
router.get("/getTask",async (req,res)=>{
    try{

        const task=await Task.find().lean().exec()
        return res.status(200).send(task)


    }
    catch(err){
        return res.status(400).send("bad request occurred")
    }
})
router.get("/singleTask/:id",async (req,res)=>{
    try{

        const task=await Task.findById(req.params.id).lean().exec()
        return res.status(200).send(task)
        

    }
    catch(err){
        return res.status(400).send("bad request occurred")
    }
})

router.patch("/updateTask/:id",async (req,res)=>{
    try{

        const task=await Task.findByIdAndUpdate(req.params.id,req.body).lean().exec()
        return res.status(200).send(task)
        

    }
    catch(err){
        return res.status(400).send("bad request occurred")
    }
})
router.put("/updateTask/:id",async (req,res)=>{
    try{

        const task=await Task.findByIdAndUpdate(req.params.id,req.body).lean().exec()
        return res.status(200).send(task)
        

    }
    catch(err){
        return res.status(400).send("bad request occurred")
    }
})
router.delete("/deleteTask/:id",async (req,res)=>{
    try{

        const task=await Task.findByIdAndDelete(req.params.id)
        return res.status(200).send(task)
        

    }
    catch(err){
        return res.status(400).send("bad request occurred")
    }
})
module.exports=router