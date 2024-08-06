import joi from "joi"
import { isValidObjectId } from "../../Middleware/validation.middleware.js"


// create category
export const createCategorySchema = joi.object({
    name: joi.string().min(4).max(15).required(),
    createdBy: joi.string().custom(isValidObjectId)
}).required() 

// update category

export const updateCategorySchema = joi.object({
    name: joi.string().min(4).max(15),
    categoryId: joi.string().custom(isValidObjectId)
}).required()

// delete category
export const deleteCategorySchema = joi.object({
    categoryId: joi.string().custom(isValidObjectId)
})