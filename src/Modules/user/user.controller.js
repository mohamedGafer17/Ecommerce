import { User } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asynchandler.js";
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import { sendEmail } from "../../utils/sendEmails.js";
import { forgetCodeTemp, signUpTemp } from "../../utils/generateHTML.js";
import jwt from "jsonwebtoken"
import { Token } from "./../../../DB/models/token.model.js"
import { Cart } from "./../../../DB/models/cart.model.js"
import Randomstring from "randomstring";

//register
export const register = asyncHandler(async (req,res,next) => {
    //data from request
    const {userName, email, password} = req.body
    //check user existence
    const isUser = await User.findOne({email})
    if (isUser) return next(new Error('Email already Register!', {cause: 409}))
    //hash password
    const hashPassword = bcryptjs.hashSync(password, Number(process.env.SALT_ROUND))
    // generate activationcode
    const activationCode = crypto.randomBytes(64).toString('hex')
    //create user
    const user = await User.create({userName, email, password : hashPassword, activationCode})
    //create confirmationLink
    const link = `http://localhost:3000/auth/confirmEmail/${activationCode}`
    //send email
    const isSent = await sendEmail({to: email, subject: "Activate Account", html: signUpTemp(link)})
    //send response
    return isSent ? res.json({success: true, message: 'please review yoy email!'}) : next(new Error('Something went wrong!'))
})

//activate account
export const activateAccount = asyncHandler(async(req, res, next) => {
    const user = await User.findOneAndUpdate({activationCode: req.params.activationCode}, {
    isConfirmed: true, $unset: {activationCode: 1}
    })
    if(!user) return next(new Error('User not Found!', {cause: 404}))

    // create a cart 
    await Cart.create({ user: user._id })

     return res.send("your account is activated now")
})

//login
export const login = asyncHandler(async (req, res, next) =>{
    // data from request
    const {email, password} = req.body
    //check user existence
    const user = await User.findOne({ email })
    if (!user) return next (new Error("IN-Valid Email!", {cause: 400}))
    
    // check isConfirmed
    if (!user.isConfirmed)
        return next(new Error("Unactivated account", {cause: 400}))

    // check password
    const match = bcryptjs.compareSync(password, user.password)
    if(!match) return next(new Error("In-Valid Password!", {cause: 400}))
    
    // generate token
    const token = jwt.sign({ id: user._id, email: user.email },
        process.env.TOKEN_KEY,
        {
            expiresIn: "2d",
        }
    )
    
    // save token in token model
    await Token.create({
        token,
        user: user._id,
        agent: req.headers["user-agent"]
    })

    // change user status to online and save user
    user.status = "online"
    await user.save()

    // send response
    return res.json({ success: true, result: token})
})
// ---------------------------------


// send forget code
export const sendForgetCode = asyncHandler(async(req, res, next) => {
    //check user
    const user = await User.findOne({ email: req.body.email })
    if (!user) return next(new Error("In-Valid Email!"))

    // generate code
    const code = Randomstring.generate({
        length: 5,
        charset: "numeric",
    })

    // save code in db
    user.forgetCode = code
    await user.save()

    // send email
    return await sendEmail({
        to: user.email,
         subject:'Reset Password',
          html: forgetCodeTemp(code)
        }) ? res.json({success: true, message: "Check your Email" }) : next(new Error("Something went wrong"))
})

// resetPassword
export const resetPassword = asyncHandler(async(req, res, next) => {
    // check user
    let user = await User.findOne({ forgetCode: req.body.forgetCode })
    if (!user) return next(new Error("In-Valid Code!"))

    user = await User.findOneAndUpdate({ email: req.body.email }, {$unset: { forgetCode: 1 }})
    console.log(user);
    user.password = bcryptjs.hashSync(
        req.body.password,
        Number(process.env.SALT_ROUND)
    )

    await user.save()

    // invalidate tokens 
    const tokens = await Token.find({ user: user._id })
    tokens.forEach(async (token) =>{
        token.isValid = false
        await token.save()
    })

    // send response
    return res.json({success: true , message: "Try To Login"})
})