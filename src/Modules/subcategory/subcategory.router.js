import { Router } from "express";
import { isAuthenticated } from "../../Middleware/authentication.middleware.js";
import { isAuthorized } from "../../Middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import { isValid } from "../../Middleware/validation.middleware.js";
import { allSubcategories, createSubcategory, deleteSubcategory, updateSubcategory } from "./subcategory.controller.js";
import { createSubCategorySchema, deleteSubCategorySchema, updateSubCategorySchema } from "./subcategory.validation.js";
const router = Router({ mergeParams: true })

// creat 
router.post('/',
      isAuthenticated,
      isAuthorized("admin"),
      fileUpload(filterObject.image).single("subcategory"),
      isValid(createSubCategorySchema),
      createSubcategory
    )

// update
router.patch('/:subcategoryId',
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("subcategory"),
  isValid(updateSubCategorySchema),
  updateSubcategory
)

// delete
router.delete('/:subcategoryId',
  isAuthenticated,
  isAuthorized("admin"),
  isValid(deleteSubCategorySchema),
  deleteSubcategory
)

// read 
router.get('/', allSubcategories)
export default router