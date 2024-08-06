import joi from "joi";
import { validateObjectId } from "../../Middleware/validation.middleware.js";


// create order schema
export const createOrderSchema = joi.object({
    address: joi.string().min(10).required(),
    coupon: joi.string().length(5),
    phone: joi.string().length(11).required(),
    payment: joi.string().valid("cash", "visa").required(),
}).required();

// cancel order
export const cancelOrederSchema = joi.object({
    orderId: joi.string().custom(validateObjectId).required()
}).required()