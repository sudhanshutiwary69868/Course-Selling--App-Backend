const express=require('express')
const Router=express.Router
const courseRouter=Router()
const {userMiddleWare}=require('../middlewares/user')
const {purchaseModel, courseModel}=require('../db')
courseRouter.post('/purchase',userMiddleWare,async function(req,res){
  const userId=req.userId
  const courseId=req.body.courseId
  if(!userId){
    res.json({
      message:"please provide a valid user id"
    })
  }
  if(userId){
    await purchaseModel.create({
      userId:userId,
      courseId:courseId
     })
     res.json({
      message:"successfully bought course"
    })
  }
  


})

courseRouter.get('/prieview',async function(req,res){//sending all the current courses
 const courses=await courseModel.find({})

 res.json({
  courses
 })

})
module.exports={
  courseRouter:courseRouter
}