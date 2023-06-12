const jwt = require("jsonwebtoken")
require("dotenv").config()
const {redisClient} = require("../config/redis")


const auth = async (req,res,next)=>{
    try {
         
        const token = req.headers.authorization;

        if(!token) return res.status(404).send("pls login again")
       
        const isTokenvalid = await jwt.verify(token,process.env.JWT_SECRET)
        
        if(!isTokenvalid) return res.send("Authentication Failed")

        const istokenBlacklist= await redisClient.get(token);
        if(istokenBlacklist) return res.send("Unauthorized")
         
        req.body.userId = isTokenvalid.userId;
        req.body.city= isTokenvalid.city

        next()

    } catch (err) {
        res.send(err.message)
    }
}

module.exports ={
    auth
}