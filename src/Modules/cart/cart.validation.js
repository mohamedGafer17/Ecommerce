import joi from "joi"
import { validateObjectId } from "../../Middleware/validation.middleware.js";

// add to cart - update cart 
export const cartSchema = joi.object({
    productId: joi.string().custom(validateObjectId).required(),
    quantity: joi.number().integer().min(1).required()
}).required()

// remove prodouct from cart
export const removeProductFromCartSchema = joi.object({
    productId: joi.string().custom(validateObjectId).required(),
}).required()
