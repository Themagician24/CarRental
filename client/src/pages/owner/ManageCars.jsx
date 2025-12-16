import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets.js'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const ManageCars = () => {
  const { isOwner, axios, currency } = useAppContext()
  const [cars, setCars] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredCars = cars.filter(car => {
    if (activeFilter === 'available') return car.isAvailable
    if (activeFilter === 'unavailable') return !car.isAvailable
    return true
  })

  const fetchOwnerCars = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get('/api/owner/cars')
      if (data.success) {
        setCars(data.cars)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCarAvailability = async (carId) => {
    try {
      const { data } = await axios.post('/api/owner/toggle-car', { carId })
      if (data.success) {
        toast.success('Car availability updated')
        setCars(prev => prev.map(car =>
          car._id === carId ? { ...car, isAvailable: !car.isAvailable } : car
        ))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const removeCar = async (carId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to remove this car?')
      if (!confirmDelete) return

      const loadingId = toast.loading('Removing car...')
      const { data } = await axios.post('/api/owner/delete-car', { carId })

      if (data.success) {
        toast.success('Car removed successfully', { id: loadingId })
        setCars(prev => prev.filter(car => car._id !== carId))
      } else {
        toast.error(data.message, { id: loadingId })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    isOwner && fetchOwnerCars()
  }, [isOwner])

  return (
    <div className='px-4 pt-8 md:px-8 lg:px-12 w-full'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          title="Manage Your Fleet"
          subTitle="Elegantly manage your car listings, monitor availability, and optimize your offerings."
        />
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Fleet</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{cars.length}</p>
              <p className="text-xs text-gray-400 mt-1">Cars listed</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🚗</span>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-blue-100 rounded-full opacity-20"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-emerald-50 p-6 shadow-lg border border-emerald-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">Available Now</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {cars.filter(car => car.isAvailable).length}
              </p>
              <p className="text-xs text-emerald-400 mt-1">Ready to book</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-100 rounded-full opacity-20"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-amber-50 p-6 shadow-lg border border-amber-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600">Daily Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {currency}{cars.reduce((sum, car) => sum + (car.pricePerDay || car.price), 0)}
              </p>
              <p className="text-xs text-amber-400 mt-1">If all booked</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-amber-100 rounded-full opacity-20"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-rose-50 p-6 shadow-lg border border-rose-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rose-600">Unavailable</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {cars.filter(car => !car.isAvailable).length}
              </p>
              <p className="text-xs text-rose-400 mt-1">Maintenance/Booked</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-rose-100 rounded-full opacity-20"></div>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2 bg-gray-100 p-1.5 rounded-xl">
            {['all', 'available', 'unavailable'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-white shadow-md text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                {filter !== 'all' && (
                  <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                    {cars.filter(c =>
                      filter === 'available' ? c.isAvailable : !c.isAvailable
                    ).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchOwnerCars}
              className="flex items-center px-4 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:shadow-lg transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </motion.div>

      {/* Cars Grid */}
      <AnimatePresence mode="wait">
        {isLoading && cars.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading your fleet...</p>
            <p className="text-sm text-gray-400 mt-2">Fetching car details</p>
          </motion.div>
        ) : filteredCars.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-4"
          >
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <span className="text-5xl">🚗</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No cars found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {activeFilter === 'all'
                ? "You haven't listed any cars yet. Add your first car to start earning!"
                : `No ${activeFilter} cars found. Try changing your filter.`
              }
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all duration-200">
              Add Your First Car
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredCars.map((car, index) => (
                <motion.div
                  key={car._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
                >
                  {/* Car Image with Status Badge */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                        car.isAvailable
                          ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-500/20 text-rose-700 border border-rose-200'
                      }`}>
                        {car.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1.5 bg-black/40 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        {car.category}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">{car.brand} {car.name}</h3>
                      <p className="text-white/90 text-sm">{car.seating_capacity} seats • {car.transmission}</p>
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-gray-500">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm">24h rate</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {currency}{car.pricePerDay || car.price}
                        <span className="text-sm font-normal text-gray-500">/day</span>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600">👥</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Seats</p>
                          <p className="font-medium">{car.seating_capacity}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                          <span className="text-purple-600">⚙️</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Transmission</p>
                          <p className="font-medium">{car.transmission}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        onClick={() => toggleCarAvailability(car._id)}
                        className={`flex-1 mr-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
                          car.isAvailable
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {car.isAvailable ? (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                            Make Unavailable
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Make Available
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => removeCar(car._id)}
                        className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 font-medium flex items-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Stats */}
      {cars.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Fleet Performance</h3>
              <p className="text-gray-300">
                {((cars.filter(car => car.isAvailable).length / cars.length) * 100).toFixed(1)}% of your fleet is available for booking
              </p>
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-3xl font-bold">{cars.length}</div>
                <div className="text-sm text-gray-300">Total Cars</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{currency}{
                  cars.reduce((sum, car) => sum + (car.pricePerDay || car.price), 0) * 30
                }</div>
                <div className="text-sm text-gray-300">Potential Monthly</div>
              </div>
              <button className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                View Analytics
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ManageCars
