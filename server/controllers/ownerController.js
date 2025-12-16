  import imageKit from "../configs/imageKit.js";
import User from "../models/User.js";
import Car from "../models/Car.js";
import fs from "fs";
import Booking from "../models/Booking.js";


  // Api to change user role
  export const changeRoleToOwner = async (req, res) => {

    try {
      const { _id } = req.user;
      await User.findByIdAndUpdate(_id, { role: "owner" });
      res.json({ success: true, message: "Now you can list cars" });

    } catch (error) {
      console.log(error.message);
      res.json({ success: false, message: error.message });
    }
  };

  // Api to list cars
  export const addCar = async (req, res) => {

    try {
     const { _id } = req.user;
     let car = JSON.parse(req.body.carData);

     // Aligner sur le schéma : price est requis (number)
     const price = Number(car.price ?? car.pricePerDay);
     if (!price || Number.isNaN(price)) {
      return res.json({ success: false, message: "Price is required" });
     }
     car.price = price;

     const imageFile = req.file;
     if (!imageFile) {
      return res.json({ success: false, message: "Image is required" });
     }

// Upload image to ImageKit
     const fileBuffer = fs.readFileSync(imageFile.path);
   const response =  await imageKit.upload({
        file: fileBuffer,
        fileName: imageFile.originalname,
        folder: "/cars",
     })


    // Optimization  through imageKit URL transformation

    const optimizedImageUrl = imageKit.url({
      path: response.filePath,
      transformation: [
          {
             width: '1280' //Width resize
          },
          {
            quality: 'auto' //Automatic quality selection (auto compression)
          },
          {
            format: 'webp' //Convert to modern format
          }
      ],
    });


   const image = optimizedImageUrl;
     await Car.create({ ...car, image, owner: _id, image });
     res.json({ success: true, message: "Car added successfully" });


    } catch (error) {
      console.log(error.message);
      res.json({ success: false, message: error.message });
    }
  };




// Api to list owner Cars

export const getOwnerCars = async (req, res) => {


  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });

  }
};

// API to Toggle Car Availability

export const toggleCarAvailability = async (req, res) => {
  try {
    const {_id} = req.user;
    const {carId} = req.body;
    const cars = await Car.findById(carId);


    // Check if car exists and belongs to owner
    if(!cars || cars.owner.toString() !== _id.toString()){
      return res.json({ success: false, message: "Car not found" });
    }
    cars.isAvailable = !cars.isAvailable;
    await cars.save();

    res.json({ success: true, message: "Car availability toggled successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}

// API to delete a car

export const deleteCar = async (req, res) => {
  try {
    const {_id} = req.user;
    const {carId} = req.body;
    const cars = await Car.findById(carId);

    // Check if car exists and belongs to owner
    if(!cars || cars.owner.toString() !== _id.toString()){
      return res.json({ success: false, message: "Car not found" });
    }
    cars.owner = null;
    cars.isAvailable = false;

    await cars.save();


    res.json({ success: true, message: "Car removed successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}

// API to get Dashboard Data

export const getDashboardData = async (req, res) => {
  try {
    const {_id, role} = req.user;
    if(role !== "owner"){
      return res.json({ success: false, message: "Access denied" });
    }

    const cars = await Car.find({ owner: _id });

    const bookings = await Booking.find({ owner: _id }).populate("car").sort({ createdAt: -1 });

  const pendingBookings = await Booking.find({ owner: _id, status: "pending" });
  const confirmedBookings = await Booking.find({ owner: _id, status: "confirmed" });

  // Calculate total earnings from confirmed bookings
  const monthlyRevenue = bookings.slice().filter(booking => booking.status === "confirmed")
  .reduce((acc, booking) => acc + booking.price, 0);

  const DashboardData = {
    totalCars: cars.length,
    totalBookings: bookings.length,
    pendingBookings: pendingBookings.length,
    completedBookings: confirmedBookings.length,
    recentBookings: bookings.slice(0, 2),
    monthlyRevenue,
  };

  res.json({ success: true, DashboardData });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}

// API to update user image

export const updateUserImage = async (req, res) => {
  try {
    const {_id} = req.user;
    const imageFile = req.file;

    // Upload image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response =  await imageKit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    // Optimization  through imageKit URL transformation
    const optimizedImageUrl = imageKit.url({
      path: response.filePath,
      transformation: [
          {
             width: '400' //Width resize
          },
          {
            quality: 'auto' //Automatic quality selection (auto compression)
          },
          {
            format: 'webp' //Convert to modern format
          }
      ],
    });
    const image = optimizedImageUrl;

    await User.findByIdAndUpdate(_id, { image });
    res.json({ success: true, message: "User image updated successfully", image });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });

  }
}
