import ratelimit from "../config/upstash.js";

const ratelimiter = async(req,res,next) =>{
    try {
        //this "My-limit" key is just for learning purpose but 
        //in production-level applications u will provide either
        //user-id or IP address for key
        const {success} = await ratelimit.limit("My-limit");
        if(!success){
            return res.status(429).json({
                message:"To many requests,please try again later"
            })
        }
        next();
    } catch (error) {
        console.log("Rate limit error",error);
        next(error)
    }
}

export default ratelimiter