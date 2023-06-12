const express = require("express")
const jwt= require("jsonwebtoken")
const bcrypt= require("bcrypt")
const {redisClient} = require("../config/redis")
const {UserModel}=require("../models/user.model")
const userRouter = express.Router()



userRouter.post("/register",async(req,res)=>{
        try {
            console.log(req.body)
            const {name,email,password,city}=req.body
            console.log(name,email,password,city)
            const userpresent = await UserModel.findOne({email})
    
            if(userpresent) res.send("user already present,login please")
            
    
            const hash =await bcrypt.hash(password,8)
    
            const newUser = new UserModel({name,email,password:hash,city})
    
            await newUser.save()
    
           res.send("signup suceesfully")
        } catch (err) {
            res.send(err.message)
        }
  
})

userRouter.post("/login",async(req,res)=>{
    
    try {

        const {email,password} =req.body
        const userpresent = await UserModel.findOne({email})
        if(!userpresent) res.send("user not present,signup please")

        const passwordcorrect = await bcrypt.compare(password,userpresent.password)
        
        if(!passwordcorrect) res.send("wrong password")
         
        const token = await jwt .sign({userId:userpresent._id,city:userpresent.city},process.env.JWT_SECRET,{expiresIn:"1hr"})
          res.send({message: "login sucess",token})  

    } catch (err) {
        res.send(err.message)
    }
})
userRouter.post("/logout",async(req,res)=>{
    try {
        const token = req.headers.authorization;

        if(!token) return res.status(404).send("unauthorized")

        await redisClient.set(req.body.userId,token,{EX:30})
          res.send("logout sucessful")
   } catch (err) {
       res.send(err.message)
   }
})



module.exports={userRouter}