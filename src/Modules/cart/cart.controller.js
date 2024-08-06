import { asyncHandler } from "../../utils/asynchandler.js";
import { Product } from "./../../../DB/models/product.model.js"
import { Cart } from "./../../../DB/models/cart.model.js"


// add to cart
export const addToCart = asyncHandler(async(req, res, next)=>{
    // data id, qty
    const { productId, quantity } = req.body

    // check product
    const product = await Product.findById(productId)
    if (!product) return next(new Error("Product not found", {cause: 404 }))

    // check stock
    if (quantity > product.availableItems)
        return next(new Error(`sorry, only ${product.availableItems} items left on the stock`))

    // if (!product.inStock(quantity));
    // return next(new Error(`sorry, only ${product.availableItems} items left on the stock`))

    // add to cart
    const cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $push: { products: { productId, quantity }}},
        { new: true}
    )

    // response
    return res.json({
        success: true,
        results: cart,
        message: "Product added successfully"
    })
})

// user cart
export const userCart = asyncHandler(async(req, res, next) =>{
    const cart = await Cart.findOne({ user: req.user._id }).populate(
        "products.productId",
        "name defaultImages.url price discount finalPrice"
    )
    return res.json({ success: true, results: cart})
})

// update cart

export const updateCart = asyncHandler(async(req, res, next) =>{
        // data id, qty
        const { productId, quantity } = req.body

        // check product
        const product = await Product.findById(productId)
        if (!product) return next(new Error("Product not found", {cause: 404 }))
    
        // check stock
        if (quantity > product.availableItems)
            return next(new Error(`sorry, only ${product.availableItems} items left on the stock`))

        // update product
        const cart = await Cart.findOneAndUpdate({ user: req.user._id, "products.productId" : productId},
             {$set: { "products.$.quantity": quantity }},
            {new: true})

        // send response
        return res.json({ success: true , results: cart})
})

// remove Product From Cart
export const removeProductFromCart = asyncHandler(async (req, res, next) =>{
    // remove
    const cart = await Cart.findOneAndUpdate({ user: req.user._id },
         {$pull: {products: {productId: req.params.productId}}},
         {new: true}
        )
    // response
    return res.json({ success: true, results: cart, message: "product removed successfully" })
})

// clear cart
 export const clearCart = asyncHandler(async (req, res, next) =>{
    const cart = await Cart.findOneAndUpdate(
         { user: req.user._id},
         {products: []},
         {new: true}
    ) 
    return res.json({ success: true, results: cart, message: "Cart Cleared " })
 })