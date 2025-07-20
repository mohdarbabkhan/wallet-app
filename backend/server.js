import express from "express"
import dotenv from "dotenv"
import ratelimiter from "./middleware/ratelimiter.js"
import { initDB } from "./config/db.js"
import transactionRoutes from "./routes/transactionRoutes.js"
dotenv.config()

const app = express()
//middleware
app.use(express.json());
// app.use(ratelimiter)
app.use("/api/transactions",transactionRoutes)

const port = process.env.PORT


initDB().then(() => {
    app.listen(port,() => {
    console.log("Server is up and running on:",port);
})
})