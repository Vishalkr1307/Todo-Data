const multer=require("multer")
const path=require("path");


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,"..//upload"))

    },
    filename:function (req,file,cb){
        cb(null,Date.now() + Math.round(1000+Math.random())+ '-' +file.originalname)
    }
})

const fileFilter=function (req,file,cb){
    if(file.mimetype=="image/jpeg" || file.mimetype=="image/jpg" || file.mimetype=="image/png"){
        cb(null,true)
    }
    else{
        cb(null,false,new Error ("i dont have a clue"))
    }
    

}

const upload=multer({
    storage: storage,
    fileFilter: fileFilter,
    limits:{
        fileSize:1024*1024*5
    }


})

const uploadSingle=(item)=>{
    return (req,res,next)=>{
        const uploadItem=upload.single(item)
        uploadItem(req,res,function (err){
            if(err instanceof multer.MulterError){
                return res.status(400).send({error:err.message,errorType:"multer error"});
            }
            else if(err){
                return res.status(400).send({error:err.message,error:"Normal error"})
            }
            else if(!req.file){
                return res.status(400).send(err.message)
            }
            else{
                next()
            }
        })
    }

}

const uploadMultiple=(item,count)=>{
    return (req,res,next)=>{
        const uploadItem=upload.array(item,count)
        uploadItem(req,res,function (err){
            if(err instanceof multer.MulterError){
                return res.status(400).send({error:err.message,errorType:"multer error"});
            }
            else if(err){
                return res.status(400).send({error:err.message,error:"Normal error"})
            }
            else if(!req.file){
                return res.status(400).send(err.message)
            }
            else{
                next()
            }
        })
    }

}