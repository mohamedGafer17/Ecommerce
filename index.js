import express from 'express'
import detenv from 'dotenv'
import { appRouter } from './src/app.router.js'
import { connectDB } from './DB/connection.js'
detenv.config()
const app = express()
const port = process.env.PORT


connectDB()

appRouter(app,express)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))