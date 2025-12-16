import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";

const CarCard = ({ car }) => {

  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/car-details/${car._id}`);
        scrollTo(0,0);
      }}
      className="
        group rounded-xl overflow-hidden shadow-lg
        hover:-translate-y-2 hover:shadow-2xl
        transition-all duration-500 cursor-pointer
        bg-white
      "
    >
      {/* ===== IMAGE CAR ===== */}
      <div className="relative h-52 sm:h-56 overflow-hidden">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge disponibilité */}
        {car.isAvailable && (
          <span className="absolute top-4 left-4 bg-green-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            Available Now
          </span>
        )}

        {/* Prix */}
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow">
          <span className="font-semibold text-sm sm:text-base">
            {currency}{car.pricePerDay}
          </span>
          <span className="text-xs sm:text-sm text-white/80"> / day</span>
        </div>
      </div>

      {/* ===== INFO CAR ===== */}
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 hover:text-primary transition-colors">
            {car.brand} {car.model}
          </h3>
          <p className="text-sm sm:text-base text-gray-500">{car.category} • {car.year}</p>
        </div>

        {/* Caractéristiques */}
        <div className="mt-4 grid grid-cols-2 gap-y-3 text-gray-600">

          <div className="flex items-center text-sm sm:text-base text-gray-600">
            <img src={assets.users_icon} alt="" className="h-4 w-4 mr-2" />
            <span>{car.seating_capacity} Seats</span>
          </div>

          <div className="flex items-center text-sm sm:text-base text-gray-600">
            <img src={assets.fuel_icon} alt="" className="h-4 w-4 mr-2" />
            <span>{car.fuel_type}</span>
          </div>

          <div className="flex items-center text-sm sm:text-base text-gray-600">
            <img src={assets.transmission_icon} alt="" className="h-4 w-4 mr-2" />
            <span>{car.transmission}</span>
          </div>

          <div className="flex items-center text-sm sm:text-base text-gray-600">
            <img src={assets.location_icon} alt="" className="h-4 w-4 mr-2" />
            <span>{car.location}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CarCard;
