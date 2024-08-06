import authRouter from './Modules/user/user.router.js'
import CategoryRouter from './Modules/category/category.router.js'
import subcategoryRouter from './Modules/subcategory/subcategory.router.js'
import brandRouter from './Modules/brand/brand.router.js'
import productRouter from './Modules/product/product.router.js'
import couponRouter from './Modules/coupon/coupon.router.js'
import cartRouter from './Modules/cart/cart.router.js'
import orderRouter from './Modules/order/order.router.js'
import morgan from 'morgan'
export const appRouter = (app, express)=>{

    // morgan
    if (process.env.NODE_ENV === "dev" ){
    app.use(morgan("common"))
    }

    // CORS
    const whitelist = ["http://127.0.0.1:5500"]

    app.use((req, res, next) =>{
        console.log(req.header("origin"));
        // activate account api
        if (req.originalUrl.includes("/auth/confirmEmail")) {
            res.setHeader("Access-Control-Allow-Origin", "*")
            res.setHeader("Access-Control-Allow-Methods", "GET")
            return next();
        }
        if (!whitelist.includes(req.header("origin"))) {
            return next(new Error("Blocked By Cors"))
        }
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.setHeader("Access-Control-Allow-Headers", "*")
        res.setHeader("Access-Control-Allow-Methods", "*")
        res.setHeader("Access-Control-Allow-Private-Network", true)
        return next()
    })
    // global middleware
    app.use(express.json())
    // routes
    //auth
    app.use("/auth", authRouter)

    // category
    app.use("/category", CategoryRouter)
    // subcategory
    app.use("/subcategory", subcategoryRouter) 
    // brand
    app.use("/brand", brandRouter) 
    // product
    app.use("/product", productRouter)
    // coupon
    app.use("/coupon", couponRouter)
    // cart
    app.use("/cart", cartRouter)
    // order
    app.use("/order", orderRouter)
    // not found page router
    app.all("*", (req, res, next)=>{
        return next(new Error('Page not found!', {cause: 404}))
    })

    app.use((error, req,res,next)=>{
        return res.status(error.cause || 500).json({success: false, message: error.message, stack: error.stack})
    })
}

// ****************************
// import authRouter from './Modules/user/user.router.js'
// import CategoryRouter from './Modules/category/category.router.js'
// import subcategoryRouter from './Modules/subcategory/subcategory.router.js'

// export const appRouter = (app, express) => {
//     // global middleware
//     app.use(express.json())
//     // routes
//     // auth
//     app.use("/auth", authRouter)

//     // category
//     app.use("/category", CategoryRouter)
//     // subcategory
//     app.use("/subcategory", subcategoryRouter) 

//     // not found page router
//     app.all("*", (req, res, next) => {
//         return next(new Error('Page not found!', { cause: 404 }))
//     })

//     app.use((error, req, res, next) => {
//         return res.status(error.cause || 500).json({ success: false, message: error.message, stack: error.stack })
//     })
// }
