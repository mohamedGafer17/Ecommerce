import joi from "joi"
import { isValidObjectId } from "../../Middleware/validation.middleware.js"


// create brand
export const createbrandSchema = joi.object({
    name: joi.string().min(4).max(15).required(),
}).required() 

// update brand

export const updatebrandSchema = joi.object({
    name: joi.string().min(4).max(15),
    brandId: joi.string().custom(isValidObjectId).required(),
}).required()

// delete brand
export const deletebrandSchema = joi.object({
    brandId: joi.string().custom(isValidObjectId).required()
}).required();