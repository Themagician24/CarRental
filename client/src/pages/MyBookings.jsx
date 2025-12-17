import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets.js'
import Title from '../components/Title.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const MyBookings = () => {
  const { axios, user, currency } = useAppContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // 🔹 Fetch user bookings
  const fetchMyBookings = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/bookings/user')
      if (data.success) setBookings(data.bookings)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    user && fetchMyBookings()
  }, [user])

  // 🔹 Utils
  const formatDate = (date) => date.split('T')[0]

  const getDays = (start, end) =>
    Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) /
        (1000 * 60 * 60 * 24)
    )

  const getPhase = (pickup, returnDate) => {
    const now = new Date()
    if (now < new Date(pickup)) return 'Upcoming'
    if (now > new Date(returnDate)) return 'Completed'
    return 'Ongoing'
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-20">
      <Title
        title="My Bookings"
        subTitle="All your reservations"
        align="left"
      />

      {/* Empty State */}
      {!loading && bookings.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-24 text-center text-gray-500"
        >
          <img
            src={assets.empty_booking}
            alt="No bookings"
            className="w-48 mx-auto mb-6 opacity-80"
          />
          <p className="text-lg font-medium">No bookings yet</p>
          <p className="text-sm">Your future rides will appear here 🚗</p>
        </motion.div>
      )}

      {/* Booking Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 mt-14"
      >
        {bookings.map((booking) => {
          const days = getDays(booking.pickupDate, booking.returnDate)
          const phase = getPhase(
            booking.pickupDate,
            booking.returnDate
          )

          return (
            <motion.div
              key={booking._id}
              variants={cardVariants}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              className="bg-white rounded-2xl border border-borderColor shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">

                {/* 🚗 Car */}
                <div className="space-y-3">
                  <div className="rounded-xl overflow-hidden">
                    <motion.img
                      src={booking.car.image}
                      alt={`${booking.car.brand} ${booking.car.model}`}
                      className="aspect-video object-cover w-full"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold leading-tight">
                      {booking.car.brand} {booking.car.model}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {booking.car.year} • {booking.car.category}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>⚙️ Automatic</p>
                    <p>⛽ Diesel</p>
                    <p>👥 5 seats</p>
                  </div>
                </div>

                {/* 📅 Infos */}
                <div className="md:col-span-2 flex flex-col justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs px-3 py-1 rounded-full bg-light">
                      Booking #{booking._id.slice(-6)}
                    </span>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {booking.status}
                    </span>

                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                      {phase}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="flex gap-8 mt-6">
                    <div className="flex gap-2">
                      <img
                        src={assets.calendar_icon_colored}
                        className="w-4 h-4 mt-1"
                      />
                      <div>
                        <p className="text-xs text-gray-400">From</p>
                        <p className="font-medium">
                          {formatDate(booking.pickupDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <img
                        src={assets.calendar_icon_colored}
                        className="w-4 h-4 mt-1"
                      />
                      <div>
                        <p className="text-xs text-gray-400">To</p>
                        <p className="font-medium">
                          {formatDate(booking.returnDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location + extras */}
                  <div className="mt-5 space-y-2 text-sm text-gray-500">
                    <p className="flex items-center gap-2">
                      <img
                        src={assets.location_icon_colored}
                        className="w-4 h-4"
                      />
                      {booking.car.location}
                    </p>

                    <div className="text-xs space-y-1">
                      <p>🕒 Duration: {days} days</p>
                      <p>🛡️ Insurance included</p>
                      <p>💳 Payment: Online</p>
                    </div>
                  </div>
                </div>

                {/* 💰 Price */}
                <div className="flex flex-col justify-between text-right">
                  <div>
                    <p className="text-xs text-gray-400">Total price</p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-3xl font-bold text-primary mt-1"
                    >
                      {currency}{booking.price}
                    </motion.p>

                    <p className="text-xs text-gray-400 mt-1">
                      {currency}{(booking.price / days).toFixed(0)} / day
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 mt-6">
                    Booked on {formatDate(booking.createdAt)}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

export default MyBookings
