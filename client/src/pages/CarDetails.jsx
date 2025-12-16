import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { assets } from '../assets/assets.js'
import Loader from '../components/Loader.jsx'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const CarDetails = () => {
  const { id } = useParams()

  const { cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext()

  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const currency = import.meta.env.VITE_CURRENCY

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
   const { data } = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate,
        returnDate,
      })
      if (data.success) {
       toast.success(data.message)
        navigate('/my-bookings')
      }else{
        toast.error(data.message)
      }
    } catch (error) {

      toast.error(error.message || 'An error occurred while booking the car.')
    }
  }

  useEffect(() => {
    setCar(cars.find((car) => car._id === id))
  }, [cars,id])

  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 mb-12'>
      {/* Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors mb-8 group"
      >
        <img
          src={assets.arrow_icon}
          alt="Back"
          className='rotate-180 opacity-65 group-hover:opacity-100 transition-opacity w-5 h-5'
        />
        <span className='font-medium'>Back to All Cars</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Image */}
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <img
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-auto md:max-h-96 object-cover transition-transform hover:scale-105 duration-700"
            />
          </div>

          {/* Car Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {car.brand} {car.model}
              </h1>
              <p className="text-xl text-gray-500 font-light">
                {car.category} • {car.year}
              </p>
            </div>

            <hr className='border-gray-200' />

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats`, label: 'Seats' },
                { icon: assets.fuel_icon, text: car.full_type, label: 'Fuel' },
                { icon: assets.car_icon, text: car.transmission, label: 'Transmission' },
                { icon: assets.location_icon, text: car.location, label: 'Location' },
              ].map(({ icon, text, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <img src={icon} alt={label} className='h-6 w-6 mb-3 opacity-70' />
                  <span className="font-semibold text-gray-900 text-lg">{text}</span>
                  <span className="text-sm text-gray-400 mt-1">{label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{car.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["360 Camera", "Apple CarPlay", "Bluetooth", "Cruise Control"].map((item) => (
                  <li
                    key={item}
                    className="flex items-center text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img src={assets.check_icon} alt="Included" className="h-5 w-5 mr-3 text-green-500" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-100 sticky top-24"
          >
            {/* Price */}
            <div className="text-center">
              <p className="flex items-center justify-center text-3xl text-gray-900 font-bold">
                {currency}{car.pricePerDay}
                <span className="text-lg text-gray-500 font-normal ml-2">/ day</span>
              </p>
            </div>

            <hr className='border-gray-200' />

            {/* Date Pickers */}
            <div className="space-y-6">
              <div className='flex flex-col gap-3'>
                <label htmlFor="pickup_date" className="font-semibold text-gray-700 text-lg">
                  Pick-Up Date
                </label>
                <input
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                  type="date"
                  className='border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                  required
                  id='pickup_date'
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className='flex flex-col gap-3'>
                <label htmlFor="return_date" className="font-semibold text-gray-700 text-lg">
                  Return Date
                </label>
                <input
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                  type="date"
                  className='border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                  required
                  id='return_date'
                />
              </div>
            </div>

            {/* Book Button */}
            <button
              type="submit"

              className="w-full bg-primary hover:bg-primary-dull transform hover:scale-105 transition-all py-4 font-semibold text-white rounded-xl shadow-lg hover:shadow-xl"
            >
              Book Now
            </button>

            <p className="text-center text-gray-400 text-sm pt-2">
              No credit card required to reserve
            </p>
          </form>
        </div>
      </div>
    </div>
  ) : <Loader />
}

export default CarDetails
