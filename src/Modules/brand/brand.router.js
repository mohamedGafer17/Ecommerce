import { Router } from "express";
import { isValid } from "./../../Middleware/validation.middleware.js"
import { createbrandSchema, deletebrandSchema, updatebrandSchema } from "./brand.validation.js";
import { isAuthenticated } from "../../Middleware/authentication.middleware.js";
import { isAuthorized } from "../../Middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import { allBrands, createBrand, deleteBrand, updateBrand } from "./brand.controller.js";
const router = Router()



// create brand
router.post("/",isAuthenticated, isAuthorized("admin"),fileUpload(filterObject.image).single("brand"), isValid(createbrandSchema), createBrand)

// update brand
router.patch("/:brandId", isAuthenticated, isAuthorized("admin"), fileUpload(filterObject.image).single("brand"),isValid(updatebrandSchema), updateBrand)

// delete brand
router.delete("/:brandId", isAuthenticated, isAuthorized("admin"),isValid(deletebrandSchema), deleteBrand)

// get  brands
router.get('/', allBrands)
export default router