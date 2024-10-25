require('dotenv').config();




const express = require('express');
const app = express();
const {userRouter}=require('./routes/user')
const {courseRouter}=require('./routes/course')
const {adminRouter}=require('./routes/admin')
app.use(express.json())

const mongoose = require('mongoose');
app.use('/user',userRouter)
app.use('/course',courseRouter)
app.use('/admin',adminRouter)


async function main(){
  //dotenv
  await mongoose.connect(process.env.MONGO_URL)
app.listen(3000)}
main()