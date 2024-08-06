import { Router } from "express";
import { isAuthenticated } from "./../../Middleware/authentication.middleware.js"
import { isValid } from "../../Middleware/validation.middleware.js";
import { cartSchema, removeProductFromCartSchema } from "./cart.validation.js";
import { addToCart, clearCart, removeProductFromCart, updateCart, userCart } from "./cart.controller.js";
const router = Router()

// add product cart
router.post("/", isAuthenticated, isValid(cartSchema), addToCart)

// user cart
router.get("/", isAuthenticated, userCart)

// update cart
router.patch("", isAuthenticated, isValid(cartSchema), updateCart)

// clear cart
router.put("/clear", isAuthenticated, clearCart)

// remove product
router.patch("/:productId", isAuthenticated, isValid(removeProductFromCartSchema), removeProductFromCart)



export default router