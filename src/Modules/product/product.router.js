import { Router } from "express";
import { isValid } from "./../../Middleware/validation.middleware.js"
import { createProductSchema, productIdSchema } from "./product.validation.js";
import { isAuthenticated } from "../../Middleware/authentication.middleware.js";
import { isAuthorized } from "../../Middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import { addProduct, allProducts, singleProduct } from "./product.controller.js";
const router = Router({ mergeParams: true })



// create product
router.post("/",isAuthenticated, isAuthorized("admin"),fileUpload(filterObject.image).fields([{name: "defaultImage", maxCount: 1},{name: "subImages", maxCount: 3}]), isValid(createProductSchema), addProduct)

// get all products
router.get("/", allProducts)


// read all products of certain category
router.get('/category/:categoryId')

// single product
router.get("/single/:productId", isValid(productIdSchema), singleProduct)

export default router;