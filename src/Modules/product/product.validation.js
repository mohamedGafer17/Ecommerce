import joi from "joi"
import { isValidObjectId, validateObjectId } from "../../Middleware/validation.middleware.js"


// create product
export const createProductSchema = joi.object({
    name: joi.string().min(2).max(20).required(),
    description: joi.string(),
    availableItems : joi.number().min(1).required(),
    price: joi.number().min(1).required(),
    discount: joi.number().min(1).max(100),
    category: joi.string().custom(isValidObjectId),
    subcategory: joi.string().custom(isValidObjectId),
    brand: joi.string().custom(isValidObjectId),
}).required() 


// export const deleteProductSchema = joi.object({
//     productId: joi.string().custom(validateObjectId).required(),
// }).required()


//single product
export const productIdSchema = joi.object({
    productId: joi.string().custom(validateObjectId).required(),
}).required()




