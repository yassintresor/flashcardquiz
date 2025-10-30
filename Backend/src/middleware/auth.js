import jwt  from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const  verifyToken =  (req,res,next)=>{
    const  header  = req.headers.authorization
    if(!header) return res.status(401).json({message:"Missing token"})
    
    // Fix: Split by space to get the token part
    const token = header.split(" ")[1]
    
    try {
        req.user = jwt.verify(token,process.env.JWT_SECRET)
        next()
    } catch (error) {
        res.status(403).json({message:"Invalid token"})
    }
}