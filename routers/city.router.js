const express = require("express")



const cityRouter = express.Router()

const {redisClient} = require("../config/redis")

const axios = require("axios")
require("dotenv").config()



const api_key = process.env.api_key

cityRouter.get("/city",async(req,res)=>{
    try {
        
    console.log(req.body)

        const city = req.query.city || req.body.city
       
        const isCityIncache=await redisClient.get(city)
        
       if(isCityIncache) return res.status(200).send({data:isCityIncache})
       

        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${city}`)

        const data = response.data
          redisClient.set(city,JSON.stringify(data),{EX:30*60});
  
          res.send(data)
          
    } catch (error) {
      return res.status(500).send(err.message)  
    }
})
module.exports={cityRouter}