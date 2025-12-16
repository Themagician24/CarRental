import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// ---------------------------------------------
// Fonction pour vérifier la disponibilité d'une voiture
// ---------------------------------------------
const checkAvailability = async (car, pickupDate, returnDate) => {
    // On cherche toutes les réservations qui chevauchent la période demandée
    const bookings = await Booking.find({
        car: car,
        pickupDate: { $lt: returnDate },
        returnDate: { $gt: pickupDate },
    });

    return bookings.length === 0;
};

// ---------------------------------------------
// API pour vérifier la disponibilité des voitures
// ---------------------------------------------
export const checkCarAvailability = async (req, res) => {
    try {
        const { pickupDate, returnDate, location } = req.body;

        if (!pickupDate || !returnDate || !location) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Récupérer toutes les voitures disponibles dans la location
        const cars = await Car.find({ location, isAvailable: true });

        // Vérifier la disponibilité pour chaque voiture
        const availabilityCarsPromises = cars.map(async (car) => {
            const isAvailable = await checkAvailability(car._id, pickupDate, returnDate);
            return { ...car._doc, isAvailable: isAvailable };
        });

        let availableCars = await Promise.all(availabilityCarsPromises);

        // Filtrer uniquement celles disponibles
        availableCars = availableCars.filter(car => car.isAvailable);

        res.json({ success: true, availableCars });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------------------------------------
// API pour créer une réservation
// ---------------------------------------------
export const createBooking = async (req, res) => {
    try {
        const { _id: userId } = req.user; // user connecté
        const { car, pickupDate, returnDate } = req.body;



        // Vérifier si la voiture est disponible
        const isAvailable = await checkAvailability(car, pickupDate, returnDate);
        if (!isAvailable) {
            return res.json({ success: false, message: "Car is not available for the selected dates" });
        }

        const carData = await Car.findById(car);


        // Calcul du prix
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const diffTime = Math.abs(returned - picked);
        const noOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // nombre de jours
        const price = carData.pricePerDay * noOfDays;

        // Créer la réservation
        await Booking.create({
            car,
            user: userId,
            owner: carData.owner,
            pickupDate,
            returnDate,
            price
        });

        res.json({ success: true, message: "Booking created successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------------------------------------
// API pour lister les réservations d'un utilisateur
// ---------------------------------------------
export const getUserBookings = async (req, res) => {
    try {
        const { _id } = req.user;
        const bookings = await Booking.find({ user: _id

         })
            .populate("car")
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------------------------------------
// API pour lister les réservations d'un propriétaire
// ---------------------------------------------
export const getOwnerBookings = async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
            return res.status(403).json({ success: false, message: "Unauthorized access" });
        }

        const bookings = await Booking.find({ owner: req.user._id })
            .populate("car user")
            .select('-user.password')
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------------------------------------
// API pour changer le statut d'une réservation
// ---------------------------------------------
export const changeBookingStatus = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingId, status } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking.owner.toString() !== _id.toString()) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        booking.status = status;
        await booking.save();

        res.json({ success: true, message: "Booking status changed successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
