import joi from 'joi'

// create coupon
export const createCouponSchema = joi.object({
    discount: joi.number().min(1).max(100).required(),
    expiredAt: joi.date().greater(Date.now()).required(),
}).required()

// update coupon
export const updateCouponSchema = joi.object({
    discount: joi.number().min(1).max(100),
    expiredAt: joi.date().greater(Date.now()),
    code: joi.string().length(5).required(),
}).required()

// delete coupon
export const deleteCouponSchema = joi.object({
    code: joi.string().length(5).required(),
}).required()