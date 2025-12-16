import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets.js'
import Loader from '../components/Loader.jsx'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const CarDetails = () => {
  const { id } = useParams()
  const { cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [isBooking, setIsBooking] = useState(false)
  const galleryRef = useRef(null)
  const currency = import.meta.env.VITE_CURRENCY

  // Mock images gallery for luxury cars
  const carImages = [
    car?.image,
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1974",
    "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=2025",
    "https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=2067"
  ]

  const luxuryFeatures = [
    { icon: "🎯", title: "360° Camera", description: "Surround view monitoring system" },
    { icon: "📱", title: "Apple CarPlay", description: "Seamless smartphone integration" },
    { icon: "🔊", title: "Premium Sound", description: "Burmester® 3D Surround Sound" },
    { icon: "❄️", title: "Climate Control", description: "4-zone automatic climate" },
    { icon: "🛋️", title: "Massage Seats", description: "Heated & ventilated massage seats" },
    { icon: "🛡️", title: "Safety Suite", description: "Advanced driver assistance" },
    { icon: "💡", title: "Ambient Lighting", description: "64-color customizable lighting" },
    { icon: "🔋", title: "Wireless Charging", description: "Fast wireless charging pad" }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsBooking(true)
    try {
      const { data } = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate,
        returnDate,
      })
      if (data.success) {
        toast.success(data.message)
        setTimeout(() => navigate('/my-bookings'), 1500)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while booking the car.')
    } finally {
      setIsBooking(false)
    }
  }

  useEffect(() => {
    const foundCar = cars.find((car) => car._id === id)
    if (foundCar) {
      setCar(foundCar)
      // Auto-scroll gallery every 5 seconds
      const interval = setInterval(() => {
        setActiveImageIndex(prev => (prev + 1) % carImages.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [cars, id])

  const calculateTotal = () => {
    if (!pickupDate || !returnDate) return 0
    const days = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24))
    return days * car.pricePerDay
  }

  if (!car) return <Loader />

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      {/* Luxury Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl z-50 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors">
              <svg className="w-5 h-5 transform -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <span className="font-medium text-lg">Back to Collection</span>
          </button>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full">
                <span className="text-blue-700 font-medium">{currency}{car.pricePerDay}/day</span>
              </div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span className="text-gray-600">Premium Selection</span>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-semibold hover:shadow-xl transition-all">
              Reserve Now
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200 mb-6">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Available Now</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight mb-4">
              {car.brand} <span className="text-blue-600">{car.model}</span>
            </h1>

            <p className="text-2xl text-gray-600 font-light max-w-3xl mx-auto">
              The epitome of luxury and performance. Experience unparalleled elegance on every journey.
            </p>
          </motion.div>

          {/* Main Image Gallery */}
          <div className="relative h-[600px] rounded-3xl overflow-hidden mb-8">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8 }}
                src={carImages[activeImageIndex]}
                alt={car.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

            {/* Gallery Navigation */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
              {carImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${activeImageIndex === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`}
                />
              ))}
            </div>

            {/* Luxury Badge */}
            <div className="absolute top-8 right-8">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-white px-6 py-3 rounded-xl shadow-2xl">
                <div className="text-sm font-light">Premium Class</div>
                <div className="text-2xl font-bold">LUXURY</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { value: car.year, label: 'Year', icon: '📅' },
              { value: car.seating_capacity, label: 'Seats', icon: '👥' },
              { value: car.transmission, label: 'Transmission', icon: '⚙️' },
              { value: car.full_type, label: 'Fuel Type', icon: '⛽' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{stat.icon}</span>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Details & Features */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 border border-gray-100 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                  <span className="text-2xl">📖</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Vehicle Overview</h2>
                  <p className="text-gray-500">Experience the extraordinary</p>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                The {car.brand} {car.model} represents the pinnacle of automotive excellence.
                With its sophisticated design, cutting-edge technology, and uncompromising performance,
                this vehicle offers an unparalleled driving experience. Every detail has been meticulously
                crafted to provide the ultimate in luxury, comfort, and safety.
              </p>
            </motion.div>

            {/* Luxury Features Grid */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Premium Features</h2>
                <div className="px-4 py-2 bg-gradient-to-r from-gray-900 to-black text-white rounded-full text-sm font-medium">
                  {luxuryFeatures.length} Features
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {luxuryFeatures.map((feature, index) => (
                  <motion.button
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedFeature(feature)}
                    className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                      selectedFeature?.title === feature.title
                        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg'
                        : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all ${
                        selectedFeature?.title === feature.title
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedFeature?.title === feature.title
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Technical Specifications */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Technical Specifications</h2>
                  <p className="text-gray-300">Engineered to perfection</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Engine Power', value: '450 HP', icon: '🚀' },
                  { label: 'Top Speed', value: '250 km/h', icon: '💨' },
                  { label: 'Acceleration', value: '4.2s (0-100)', icon: '⚡' },
                  { label: 'Fuel Economy', value: '8.5 L/100km', icon: '📊' },
                  { label: 'Drive Type', value: 'AWD', icon: '🔄' },
                  { label: 'Weight', value: '1,850 kg', icon: '⚖️' }
                ].map((spec) => (
                  <div key={spec.label} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl">{spec.icon}</span>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">{spec.value}</div>
                    <div className="text-gray-300 text-sm">{spec.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Booking Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-32">
              <div className="bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-light opacity-90">STARTING FROM</div>
                      <div className="text-4xl font-bold">{currency}{car.pricePerDay}<span className="text-xl font-light">/day</span></div>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-2xl">✨</span>
                    </div>
                  </div>
                  <p className="text-sm opacity-90">All taxes & insurance included</p>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Date Selectors */}
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Pick-Up Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          📅
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        Return Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                          min={pickupDate}
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          📅
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Calculation */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Daily Rate</span>
                      <span className="font-semibold">{currency}{car.pricePerDay}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Estimated Days</span>
                      <span className="font-semibold">
                        {pickupDate && returnDate
                          ? Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24))
                          : 0
                        }
                      </span>
                    </div>
                    <hr className="my-3 border-gray-200" />
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {currency}{calculateTotal()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isBooking}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isBooking ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          Processing Reservation...
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-center">
                            <span className="mr-3">🚀</span>
                            Reserve This Vehicle
                            <span className="ml-3">✨</span>
                          </div>
                          <div className="text-sm font-light opacity-90 mt-1">
                            No deposit required • 24/7 Support
                          </div>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="w-full border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-4 rounded-xl transition-all hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-center">
                        <span className="mr-2">💬</span>
                        Contact Concierge
                      </div>
                    </button>
                  </div>

                  {/* Additional Info */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Free Cancellation
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Premium Insurance
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Concierge Card */}
              <div className="mt-6 bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center">
                    <span className="text-2xl">👑</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Premium Concierge</h3>
                    <p className="text-gray-300 text-sm">24/7 Dedicated Support</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  Your personal concierge is available to assist with delivery, setup, and any special requests.
                </p>
                <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm py-3 rounded-xl transition-all">
                  <div className="flex items-center justify-center gap-2">
                    <span>📞</span>
                    Request Callback
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating CTA */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
      >
        <div className="bg-gradient-to-r from-gray-900 to-black text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-xl">🚗</span>
            </div>
            <div>
              <div className="font-bold">{car.brand} {car.model}</div>
              <div className="text-sm text-gray-300">Available for reservation</div>
            </div>
          </div>
          <button
            onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Reserve Now
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default CarDetails
