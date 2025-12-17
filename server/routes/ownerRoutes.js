import express from "express";
import { protect } from "../middleware/auth.js";
import { addCar,
     changeRoleToOwner,
      deleteCar,
       getDashboardData,
        getOwnerCars,
        toggleCarAvailability,
        updateUserImage
     } from "../controllers/ownerController.js";
import asyncHandler from '../middleware/asyncHandler.js';
import upload from "../middleware/upload.js";



const ownerRouter = express.Router();

ownerRouter.post('/change-role', protect, asyncHandler(changeRoleToOwner))
ownerRouter.post('/add-car', protect, upload.single('image'), asyncHandler(addCar))
ownerRouter.get('/cars', protect, asyncHandler(getOwnerCars))
ownerRouter.post('/toggle-car', protect, asyncHandler(toggleCarAvailability))
ownerRouter.post('/delete-car', protect, asyncHandler(deleteCar))

ownerRouter.get('/dashboard', protect, asyncHandler(getDashboardData));

// Protéger d'abord pour disposer de req.user dans le controller
ownerRouter.post('/update-image', protect, upload.single("image"), asyncHandler(updateUserImage))

export default ownerRouter;
