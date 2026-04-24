import express from "express";
import { changeBookingStatus, checkCarAvailability, createBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js";
import asyncHandler from '../middleware/asyncHandler.js';
import { protect } from "../middleware/auth.js";




const bookingRouter = express.Router();

bookingRouter.post('/check-availability', asyncHandler(checkCarAvailability));
bookingRouter.post('/create', protect, asyncHandler(createBooking));
bookingRouter.get('/user', protect, asyncHandler(getUserBookings));
bookingRouter.get('/owner', protect, asyncHandler(getOwnerBookings));
bookingRouter.post('/change-status', protect, asyncHandler(changeBookingStatus));


export default bookingRouter;

