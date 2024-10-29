const express = require("express");
const { userModel, purchaseModel, courseModel } = require('../db');
const bcrypt = require('bcrypt');
const Router = express.Router;
const userRouter = Router();
const { z, string } = require('zod');
const jwt = require('jsonwebtoken');
const { JWT_USER_PASSWORD } = require('../config');
const { userMiddleWare } = require('../middlewares/user');
const {limiter}=require('../middlewares/ratelimit')
userRouter.use(limiter)
const cookieParser = require('cookie-parser');
userRouter.use(cookieParser())


userRouter.post('/signup', async function (req, res) {
    const validation = z.object({
        email: string().email().min(5).max(20),
        password: string().min(4).max(20).refine(val => /[A-Z]/.test(val), {
            message: "One uppercase is needed"
        }).refine(val => /[a-z]/.test(val), {
            message: "one lowercase is required"
        }).refine(val => /\d/.test(val), {
            message: "contain one number"
        }),
        lastName: string().min(3).max(10),
        firstName: string().min(3).max(10)
    });

    const dataparsed = validation.safeParse(req.body);
    if (!dataparsed.success) {
        return res.json({ error: dataparsed.error.issues });
    }

    const { email, password, firstName, lastName } = dataparsed.data;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 7);

        await userModel.create({
            email,
            password: hashedPassword,
            lastName,
            firstName
        });

        res.status(201).json({ message: "Signup succeeded" });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error: error.message });
    }
});


userRouter.post('/signin', async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Sign-in failed", error: error.message });
    }
});

userRouter.get('/purchase', userMiddleWare, async function (req, res) {
    try {
        const userId = req.userId;
        const purchases = await purchaseModel.find({ userId });
       
        const courseData=await courseModel.find({
          _id:{$in:purchases.map(x=>x.courseId)}
        })
        res.json({ purchases ,
          courseData
        });
    } 
     catch (error) {
        res.status(500).json({ message: "Failed to fetch purchases", error: error.message });
    }
});

module.exports = { userRouter };
