import jwt from "jsonwebtoken"
import { Token } from "./../../DB/models/token.model.js"
import { User } from "./../../DB/models/user.model.js"
import { asyncHandler } from "../utils/asynchandler.js"

export const isAuthenticated = asyncHandler(async(req,res,next) =>{
        let token = req.headers["token"]
        if (!token || !token.startsWith(process.env.BEARER_KEY))
            return next(new Error("Valid token is required!", 400))
    
        token = token.split(process.env.BEARER_KEY)[1]
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        if (!decoded) return next(new Error("In-Valid Token!"))
    
        const tokenDB= await Token.findOne({ token, isValid: true})
        if (!tokenDB) return next(new Error("Token Expired!"))
        
        const user = await User.findOne({ email: decoded.email })
        if(!user) return next(new Error("User Not Found!"))
    
        req.user = user
    
        return next()
    })
