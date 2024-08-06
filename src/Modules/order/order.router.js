import { Router } from "express";
import { isAuthenticated } from "./../../Middleware/authentication.middleware.js"
import { isValid } from "./../../Middleware/validation.middleware.js"
import { cancelOrederSchema, createOrderSchema } from "./order.validation.js";
import { cancelOrder, createOrder } from "./order.controller.js";
const router = Router()

//create order//

router.post("/", isAuthenticated, isValid(createOrderSchema), createOrder)

// cancel order
router.patch("/:orderId", isAuthenticated, isValid(cancelOrederSchema), cancelOrder)
export default router