const express=require('express')
const Router=express.Router
const adminRouter=Router()
const {adminModel,courseModel}=require('../db')
const {z,string}=require('zod')
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
const {JWT_ADMIN_PASSWORD}=require('../config')
const { AdminMiddleware } = require('../middlewares/admin')
const {limiter}=require('../middlewares/ratelimit')
adminRouter.use(limiter)
const cookieParser = require('cookie-parser');
adminRouter.use(cookieParser())




adminRouter.post('/signup',async function(req,res){
  const validation=z.object({
    email:string().email().min(5).max(20),
    password:string().min(4).max(20).refine(val=>/[A-Z]/.test(val),{
      message:"One uppercase is needed"
    }).refine(val=>/[a-z]/.test(val),{
      message:"one lowercase is required"
    }).refine(val=>/\d/.test(val),{
      message:"cointain one number"
    }),
    lastName:string().min(3).max(10),
    firstName:string().min(3).max(10)
  })
  const dataparsed=validation.safeParse(req.body)
  if(!dataparsed.success){
    res.json({
      error:dataparsed.error.issues
    })
    return;

  }
  const{email,password,firstName,lastName}=req.body //destructuring of code
  try{
    const existingAdmin=await adminModel.findOne({email})
    if(existingAdmin){
      return res.status(409).json({message:"email is already in use"})
    }
  const hashedPassword=await bcrypt.hash(password,7)

  await adminModel.create({
    email:email,
    password:hashedPassword,
    lastName:lastName,
    firstName:firstName

  }
)
res.status(201).json({
  message:"signup succed"
})
  }catch(e){
    res.status(500).json({
      message:"signup failed"
    })

  }

})
adminRouter.post('/signin',async function(req,res){
  const {email,password}=req.body
  const admin=await adminModel.findOne({
    email:email,
 
  })
  if(!admin){
  return  res.json({
      message:"user does not exist"
    })
 

  }
  const hashedPassword=await bcrypt.compare(password,admin.password)
  if(!hashedPassword){
    res.json({
      message:"incorrect password"
    })
    return
  }
 const token= jwt.sign({id:admin._id},JWT_ADMIN_PASSWORD)
res.cookie('token',token,{
  httpOnly:true,
  maxAge:360000,
  sameSite:'strict'

})
return res.json({
  message:"login successful"
})


})

adminRouter.post('/course',AdminMiddleware,async function(req,res){
  const adminId=req.userId
  const {title,description,imageUrl,price}=req.body
 const course= await courseModel.create({
    title,
    description,
    imageUrl,
    price,
    AdminId:adminId

  })
  res.json({
    message:"course created",
    courseId:course._id 
  })



})
adminRouter.put('/course',AdminMiddleware,async function(req,res){
  const adminId=req.userId
  const {title,description,imageUrl,price,courseId}=req.body
 const course= await courseModel.updateOne({
  _id:courseId,
  AdminId:adminId

 }, {
    title,
    description,
    imageUrl,
    price,
   

  })
  res.json({
    message:"course updated",
    courseId:course._id 
  })



})
adminRouter.get('/course/bulk',AdminMiddleware,async function(req,res){
const adminId=req.userId
const courses=await courseModel.find({
  creatorId:adminId
})
res.json({
  courses
})
})



module.exports={
  adminRouter:adminRouter
}