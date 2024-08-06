import { Router } from "express";
const router = Router()
import { isAuthenticated } from "../../Middleware/authentication.middleware.js";
import { isAuthorized } from "../../Middleware/authorization.middleware.js";
import { isValid } from "./../../Middleware/validation.middleware.js"
import { createCouponSchema, deleteCouponSchema, updateCouponSchema } from "./coupon.validation.js";
import { createCoupon, deleteCoupon, updateCoupon, allCoupons } from "./coupon.controller.js";


// create coupon
router.post("/", isAuthenticated, isAuthorized("admin"), isValid(createCouponSchema), createCoupon)

// update coupon
router.patch("/:code", isAuthenticated, isAuthorized("admin"), isValid(updateCouponSchema), updateCoupon)

// delete coupon
router.delete("/:code", isAuthenticated, isAuthorized("admin"), isValid(deleteCouponSchema), deleteCoupon)
// get all coupons
router.get("/", allCoupons)

export default router;