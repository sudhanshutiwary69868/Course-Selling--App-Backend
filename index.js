require('dotenv').config();

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});


app.use(cookieParser())
const express = require('express');
const app = express();
const {userRouter}=require('./routes/user')
const {courseRouter}=require('./routes/course')
const {adminRouter}=require('./routes/admin')
app.use(express.json())

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
app.use('/user',userRouter)
app.use('/course',courseRouter)
app.use('/admin',adminRouter)


async function main(){

  await mongoose.connect(process.env.MONGO_URL)
app.listen(3000)}
main()