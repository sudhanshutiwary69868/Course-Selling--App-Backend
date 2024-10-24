const express=require('express')
const Router=express.Router
const courseRouter=Router()
courseRouter.post('/purchase',function(req,res){

})

courseRouter.get('/prieview',function(req,res){
  res.json({
    message:"all the courses"
  })

})
module.exports={
  courseRouter:courseRouter
}