import { asyncHandler } from "../../utils/asynchandler.js";
import voucher_codes from "voucher-code-generator"
import { Coupon } from "../../../DB/models/coupon.model.js"

// create

export const createCoupon = asyncHandler(async(req, res, next) =>{
    // generate code
    const code = voucher_codes.generate({ length: 5})

    // create coupon
    const coupon = await Coupon.create({
        name: code[0],
        discount: req.body.discount,
        expiredAt: new Date(req.body.expiredAt).getTime(),
        createdBy: req.user._id,
    })

    return res.status(201).json({ success: true, results: coupon})
})

// update
export const updateCoupon = asyncHandler(async(req, res, next) =>{
    // check coupon 
    const coupon = await Coupon.findOne({
        name: req.params.code,
        expiredAt: { $gt: Date.now() }
    })
    if (!coupon) return next(new Error("Invalid code"))
    // check owner
    if (req.user.id !== coupon.createdBy.toString())
        return next(new Error("You are not Owner"))
    
     coupon.discount = req.body.discount ? req.body.discount : coupon.discount
     coupon.expiredAt = req.body.expiredAt ? new Date(req.body.expiredAt).getTime() : coupon.expiredAt
     
     await coupon.save()
     return res.json({success: true , results: coupon, message: "Coupon updated successfully"})
})

// delete
export const deleteCoupon = asyncHandler(async(req, res, next) =>{
    // check coupon 
    const coupon = await Coupon.findOne({
        name: req.params.code,
    })
    if (!coupon) return next(new Error("Invalid code"))

    // check owner
    if (req.user.id !== coupon.createdBy.toString())
        return next(new Error("You are not Owner"))

    await Coupon.findOneAndDelete({name: req.params.code})

    return res.json({ success: true, message: "Coupon deleted successfully"})
})

// all coupons
export const allCoupons = asyncHandler(async(req, res, next) =>{
    const coupons = await Coupon.find({})

    return res.json({ success: true , results: coupons})
})