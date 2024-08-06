import { Router } from "express";
import { isValid } from "./../../Middleware/validation.middleware.js"
import { createCategorySchema, deleteCategorySchema, updateCategorySchema } from "./category.validation.js";
import { isAuthenticated } from "../../Middleware/authentication.middleware.js";
import { isAuthorized } from "../../Middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import { allCategories, createCategory, deleteCategory, updateCategory } from "./category.controller.js";
import  subcategoryRouter   from "./../subcategory/subcategory.router.js"
import  productRouter   from "./../product/product.router.js"
const router = Router()

router.use("/:categoryId/subcategory", subcategoryRouter)
router.use("/:categoryId/products", productRouter)

// create category
router.post("/",isAuthenticated, isAuthorized("admin"),fileUpload(filterObject.image).single("category"), isValid(createCategorySchema), createCategory)

// update category
router.patch("/:categoryId", isAuthenticated, isAuthorized("admin"), fileUpload(filterObject.image).single("category"),isValid(updateCategorySchema), updateCategory)

// delete category
router.delete("/:categoryId", isAuthenticated, isAuthorized("admin"),isValid(deleteCategorySchema), deleteCategory)

// get  categories
router.get('/', allCategories)
export default router