import { asyncHandler } from "../../utils/asynchandler.js";
import cloudinary from "../../utils/cloud.js";
import { nanoid} from 'nanoid'
import { Product }  from "./../../../DB/models/product.model.js"
import slugify from "slugify";
import { Category } from "./../../../DB/models/category.model.js"
import { Subcategory } from "./../../../DB/models/subcategory.model.js"
import { Brand } from "./../../../DB/models/brand.model.js"


// create product
export const addProduct = asyncHandler(async(req,res,next) =>{
    // data
    // const {name, description, price, discount, avaliableItems, category, subcategory, brand} = req.body

    // check category
    const category = await Category.findById(req.body.category)
    if (!category) return next(new Error("Category not found", {cause: 404}))

    // check category
    const subcategory = await Subcategory.findById(req.body.subcategory)
    if (!subcategory) return next(new Error("Subcategory not found", {cause: 404}))

            // check category
    const brand = await Brand.findById(req.body.brand)
    if (!brand) return next(new Error("Brand not found", {cause: 404}))
    // file
    if(!req.files)
        return next(new Error("Product images are required", {cause: 400}))

    // create unique folder name
    const cloudFolder = nanoid()
    let images = [];

    // upload files
    for (const file of req.files.subImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            file.path,
            { folder: `${process.env.CLOUD_FOLDER}/products/${cloudFolder}`}
        )
        images.push({ id: public_id, url: secure_url})
    }

    // upload default image
    
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.defaultImage[0].path,
        { folder: `${process.env.CLOUD_FOLDER}/products/${cloudFolder}`}
        )

    // create product
    const product = await Product.create({
        ...req.body,
        slug: slugify(req.body.name),
        cloudFolder,
        createdBy: req.user._id,
        defaultImages: { url: secure_url, id: public_id},
        images,
    })

    // send response
    return res.status(201).json({success: true, results: product})
})

// // // delete product
// export const deleteProduct = asyncHandler(async(req, res, next) => {
//     // check product
// const product = await Product.findById(req.params.productId) 
// if(!product) return next(new Error("Product not found"))
//     // check owner
// if (req.user._id.toString() != product.createdBy.toString())
//     return next(new Error("Not authorized", { cause: 401 } ))
// const imagesArr = product.images
// const ids = imagesArr.map((imageObj) => imageObj.id)
// console.log(ids);
// ids.push(product.defaultImage.id)

// // delete image
// const result = await cloudinary.api.delete_resources(ids)
// console.log(result);

// //delete folder
// await cloudinary.api.delete_folder(
//     `${process.env.FOLDDER_CLOUD_NAME}/products/${product.cloudFolder}`
// )

// // delete product from DB
// await Product.findByIdAndDelete(req.params.productId)

// // send response
// return res.json({ success: true, message: " Product Deleted Successfully "})

// })


// all products
export const allProducts = asyncHandler(async(req, res, next) =>{
    
    if (req.params.categoryId) {
        const category = await Category.findById(req.params.categoryId)
        if (!category)
            return next(new Error("Category not found", {cause: 404 }))
        const products = await Product.find({ category: req.params.categoryId })
        return res.json({ success: true, results: products})
    }



    // ************search********* 
    // const { keyword } = req.query
    // const products = await Product.find({
    //     $or: [
    //         { name : { $regex: keyword, $options: "1"} },
    //         { description: { $regex: keyword, $options: "1"}}
    //     ],
    // });

    // ***********filter***********
    // const products = await Product.find({...req.query})
    // return res.json({ success: true, results: products})


    // **********sort*********
    // const { sort } = req.query
    // const products = await Product.find().sort(sort)
    // return res.json({ success: true, results: products})



    const products = await Product.find({ ...req.query})
    .paginate(req.query.page)
    .customSelect(req.query.fields)
    .sort(req.query.sort)
    return res.json({success: true , results: products})

})

// single product
export const singleProduct = asyncHandler(async(req, res, next) => {
    const product = await Product.findById(req.params.productId)
    if(!product) return next(new Error("product not Found"))
    return res.json({ success: true , results: product})
})



