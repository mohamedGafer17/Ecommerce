import {Router} from 'express'
import { isValid } from '../../Middleware/validation.middleware.js'
import { activateSchema, forgetCodeSchema, loginSchema, registerSchema, resetPasswordSchema } from './user.validation.js'
import { activateAccount, login, register, resetPassword, sendForgetCode } from './user.controller.js'

const router = Router()
//Register
router.post("/register", isValid(registerSchema), register)


//Activate Account
router.get("/confirmEmail/:activationCode", isValid(activateSchema), activateAccount)

// Login
router.post("/login", isValid(loginSchema), login)


// send forget password code
router.patch("/forgetCode", isValid(forgetCodeSchema), sendForgetCode)

// Reset Pasword
router.patch("/resetPassword", isValid(resetPasswordSchema), resetPassword)
export default router