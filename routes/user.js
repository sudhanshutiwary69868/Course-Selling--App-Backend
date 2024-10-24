const express=require("express")  //creates object which has key of router
  const {userModel} =require('../db')
  const bcrypt=require('bcrypt')
const Router=express.Router
const userRouter=Router() //it is a function which i called 
const {z,string}=require('zod')
const jwt=require('jsonwebtoken')
const {JWT_USER_PASSWORD}=require('../config')

userRouter.post('/signup',async function(req,res){
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
    const existingUser=await userModel.findOne({email})
    if(existingUser){
      return res.status(409).json({message:"email is already in use"})
    }
  const hashedPassword=await bcrypt.hash(password,7)

  await userModel.create({
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
})}})
userRouter.post('/signin',async function(req,res){
  const {email,password}=req.body
  const user=await userModel.findOne({
    email:email,
 
  })
  if(!user){
    res.json({
      message:"user does not exist"
    })
    return

  }
  const hashedPassword=await bcrypt.compare(password,user.password)
  if(!hashedPassword){
    res.json({
      message:"incorrect password"
    })
    return
  }
 const token= jwt.sign({id:user._id},JWT_USER_PASSWORD)
 res.json({
  token:token
 })


})

userRouter.get('/purchase',function(req,res){

})
module.exports={
  userRouter:userRouter
}