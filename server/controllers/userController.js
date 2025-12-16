import User from "../models/User.js"
import Car from "../models/Car.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


// ================================
// 🔐 Generate JWT Token
// ================================
// This helper creates a JWT token using the user ID.
// ⚠️ Note: The payload is a simple string here (userId),
// which works fine as long as you DON'T use options like expiresIn.
// ================================
const generateToken = (userId) => {
    const payload = userId; // Token payload (just the user ID)
    return jwt.sign(payload, process.env.JWT_SECRET) // Sign with the secret key
}



// ================================
// 📝 Register User (sign up)
// ================================
export const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body // Extract request body

        // Basic validation: ensure required fields exist + password length check
        if (!name || !email || !password || password.length < 8) {
            return res.json({success: false, message: "Please enter valid details"})
        }

        // Check if a user already exists with this email
        const userExists =  await User.findOne({email})

        if (userExists) {
            return res.json({success: false, message: "User already exists"})
        }

        // Encrypt the password using bcrypt (10 = salt rounds)
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create a new user in the database
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        // Generate a JWT token for the new user
        const token = generateToken(user._id.toString())

        // Send success response with token
        res.json({
            success: true,
            token,
            message: "User registered successfully"
        })

    } catch (error) {
        console.log(error.message) // Log technical error for debugging
        res.json({success: false, message: "Something went wrong"}) // Generic error sent to client
    }
}



// ================================
// 🔑 Login User (sign in)
// ================================
export const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body // Extract login credentials

        // Look for a user with this email
        const user = await User.findOne({email})

        if (!user) {
            return res.json({success: false, message: "User not found"})
        }

        // Compare provided password with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({success: false, message: "Invalid credentials"})
        }

        // Generate a new token for authenticated user
        const token = generateToken(user._id.toString())

        // Send success response with token
        res.json({
            success: true,
            token,
            message: "User logged in successfully"
        })

    } catch (error) {
        console.log(error) // Log full server-side error
        res.json({success: false, message: "Something went wrong"}) // Client-friendly error message

    }
}

// Get user data using Token (JWT)

export const getUserData = async (req, res) => {
    try {
        const {user} = req
        res.json({success: true, user})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Something went wrong"})
    }
}


// ================================
// 🚗 Public: récupérer toutes les voitures disponibles
// ================================
export const getAllCars = async (_req, res) => {
    try {
        const cars = await Car.find({ isAvailable: { $ne: false } })
        res.json({ success: true, cars })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Failed to fetch cars" })
    }
}







