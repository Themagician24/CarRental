import express from 'express';
import { getAllCars, getUserData, loginUser, registerUser } from '../controllers/userController.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { protect } from '../middleware/auth.js';

 const userRouter = express.Router();

 userRouter.post('/register', asyncHandler(registerUser));
 userRouter.post('/login', asyncHandler(loginUser));
 userRouter.get('/data', protect, asyncHandler(getUserData));
 userRouter.get('/cars', asyncHandler(getAllCars));

 export default userRouter
