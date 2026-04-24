import cors from 'cors'
import "dotenv/config"
import express from 'express'
import connectDB from './configs/db.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import bookingRouter from './routes/bookingRoutes.js'
import ownerRouter from './routes/ownerRoutes.js'
import userRouter from './routes/userRoutes.js'


//Initialize Express App
const app = express()


// Connect to DB
await connectDB()

//Middlewares
app.use(express.json())
app.use(cors())


//Routes
app.get("/", (req, res) =>
    res.send("Server is running")
)
app.use("/api/user", userRouter)
app.use("/api/owner", ownerRouter)
app.use('/api/bookings', bookingRouter)

// 404 + error handler (must be after routes)
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}
    `))
