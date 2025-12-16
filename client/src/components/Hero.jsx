import React, { useState, useEffect } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { motion } from 'framer-motion'

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)

  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext()

  // Synchroniser avec le contexte existant
  useEffect(() => {
    if (pickupDate) {
      setStartDate(new Date(pickupDate))
    }
  }, [pickupDate])

  useEffect(() => {
    if (returnDate) {
      setEndDate(new Date(returnDate))
    }
  }, [returnDate])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!pickupLocation || !startDate || !endDate) {
      alert('Please fill all fields')
      return
    }

    const formatDate = (date) => {
      return date.toISOString().split('T')[0]
    }

    navigate(`/cars?pickupLocation=${pickupLocation}&pickupDate=${formatDate(startDate)}&returnDate=${formatDate(endDate)}`)
  }

  const calculateDays = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    }
    return 0
  }

  const handleDateChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)

    if (start) {
      setPickupDate(start.toISOString().split('T')[0])
    }
    if (end) {
      setReturnDate(end.toISOString().split('T')[0])
    }
  }

  const getMinReturnDate = () => {
    return startDate ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) : new Date()
  }

  return (
    <div className='relative h-screen flex flex-col items-center justify-center gap-8 md:gap-12 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-center overflow-hidden'>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className='relative z-10 max-w-5xl mx-auto px-4'>
        {/* Header - Réduit */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='mb-8'
        >
          <h1 className='text-3xl md:text-5xl font-bold text-white mb-3'>
            Premium <span className='text-blue-400'>Luxury Cars</span> on Rent
          </h1>
          <p className='text-base md:text-lg text-gray-300 max-w-xl mx-auto'>
            Experience ultimate comfort and style with our exclusive collection
          </p>
        </motion.div>

        {/* Search Form - Taille réduite */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSearch}
          className='bg-white/10 backdrop-blur-lg rounded-xl md:rounded-2xl p-5 md:p-6 w-full max-w-4xl mx-auto border border-white/20 shadow-xl'
        >
          <div className='flex flex-col lg:flex-row items-stretch gap-4 md:gap-5'>

            {/* Location Selector - Réduit */}
            <div className='flex-1'>
              <div className="relative group">
                <label className='block text-left text-white text-xs font-medium mb-1.5 ml-1'>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Pickup Location
                  </span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className='w-full px-3.5 py-3 text-sm bg-white/5 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all cursor-pointer appearance-none'
                  >
                    <option value="" className="bg-gray-800 text-white">Select a city</option>
                    {cityList.map((city) => (
                      <option key={city} value={city} className="bg-gray-800 text-white">
                        {city}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {pickupLocation && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='text-xs text-blue-300 mt-1.5 ml-1 flex items-center gap-1'
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {pickupLocation}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Date Range Picker - Réduit */}
            <div className='flex-1 relative'>
              <label className='block text-left text-white text-xs font-medium mb-1.5 ml-1'>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Rental Period
                </span>
              </label>

              <div className="relative">
                <div
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full px-3.5 py-3 text-sm bg-white/5 border-2 border-white/20 rounded-lg text-white cursor-pointer hover:border-blue-500/50 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <div className="text-xs text-gray-400">From</div>
                      <div className="font-medium">
                        {startDate ? startDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        }) : 'Select date'}
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm">→</div>
                    <div className="text-left">
                      <div className="text-xs text-gray-400">To</div>
                      <div className="font-medium">
                        {endDate ? endDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        }) : 'Select date'}
                      </div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                {showCalendar && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-1.5 z-50 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-3"
                  >
                    <DatePicker
                      selected={startDate}
                      onChange={handleDateChange}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      inline
                      minDate={new Date()}
                      monthsShown={2}
                      calendarClassName="bg-gray-900 text-white"
                      dayClassName={() => "text-white hover:bg-blue-600 rounded"}
                    />
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
                      <div className="text-xs text-gray-400">
                        {calculateDays() > 0 && `${calculateDays()} days`}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCalendar(false)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Date Summary - Réduit */}
              {(startDate || endDate) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    {startDate && (
                      <span className="text-green-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {startDate.toLocaleDateString()}
                      </span>
                    )}
                    {endDate && (
                      <span className="text-blue-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {endDate.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {calculateDays() > 0 && (
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full text-xs">
                      {calculateDays()} day{calculateDays() > 1 ? 's' : ''}
                    </span>
                  )}
                </motion.div>
              )}
            </div>

            {/* Search Button - Réduit */}
            <div className='flex items-end'>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type='submit'
                className='w-full lg:w-auto px-6 py-3 text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold shadow-md shadow-blue-500/30 flex items-center justify-center gap-2 transition-all group'
              >
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Find Cars</span>
              </motion.button>
            </div>
          </div>

          {/* Quick Options - Réduit */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Today', days: 0 },
              { label: 'Tomorrow', days: 1 },
              { label: 'Weekend', days: getDaysUntilWeekend() },
              { label: 'Next Week', days: 7 }
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  const start = new Date()
                  start.setDate(start.getDate() + option.days)
                  const end = new Date(start)
                  end.setDate(end.getDate() + 3)
                  handleDateChange([start, end])
                }}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs transition-all hover:border-blue-500/50"
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.form>

        {/* Car Image - Réduite */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative mt-8"
        >
          <img
            src={assets.main_car}
            alt='Luxury Car'
            className='max-h-72 md:max-h-80 w-auto mx-auto drop-shadow-xl'
          />

          {/* Floating Info Cards - Réduites */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {[
              { icon: '🚗', text: 'Premium' },
              { icon: '⭐', text: '5-Star' },
              { icon: '🛡️', text: 'Insured' },
              { icon: '💰', text: 'Best Price' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 text-white text-xs"
              >
                <span className="text-xs">{item.icon}</span>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Helper function
function getDaysUntilWeekend() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  if (dayOfWeek === 0 || dayOfWeek === 6) return 0
  if (dayOfWeek === 5) return 1
  return 6 - dayOfWeek
}

export default Hero
