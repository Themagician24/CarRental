import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets.js'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiTrendingUp,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiActivity
} from 'react-icons/fi'
import { BsGraphUpArrow } from 'react-icons/bs'

const Dashboard = () => {
  const {axios,isOwner,currency} = useAppContext()
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('today')

  const [data, setData] = useState({
     totalCars: 0,
     totalBookings: 0,
     pendingBookings: 0,
     completedBookings: 0,
     recentBookings: [],
     monthlyRevenue: 0,
     revenueGrowth: 0,
     topPerformingCars: []
  })

  const dashboardCards = [
    {
      title: "Total Cars",
      value: data.totalCars,
      icon: assets.carIconColored,
      color: "from-blue-500 to-cyan-500",
      iconComponent: <FiActivity className="text-xl" />
    },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.listIconColored,
      color: "from-purple-500 to-pink-500",
      iconComponent: <FiCalendar className="text-xl" />
    },
    {
      title: "Pending Bookings",
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
      color: "from-amber-500 to-orange-500",
      iconComponent: <FiClock className="text-xl" />
    },
    {
      title: "Completed Bookings",
      value: data.completedBookings,
      icon: assets.listIconColored,
      color: "from-green-500 to-emerald-500",
      iconComponent: <FiCheckCircle className="text-xl" />
    }
  ]

  const timeFilters = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' }
  ]

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const {data: response} = await axios.get(`/api/owner/dashboard?filter=${activeFilter}`)
      if (response.success) {
        setData(response.DashboardData)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData()
    }
  }, [isOwner, activeFilter])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -5, transition: { duration: 0.2 } }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const shimmerEffect = `
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
  `

  if (isLoading) {
    return (
      <div className='px-4 pt-10 md:px-10 flex-1'>
        <style>{shimmerEffect}</style>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-10"></div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='px-4 pt-10 md:px-10 flex-1'
    >

      <Title
        title="Admin Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"
      />

      {/* Time Filter */}
      <div className="flex items-center gap-2 mb-8">
        {timeFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeFilter === filter.id
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Dashboard Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl"
      >
        {dashboardCards.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover="hover"
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl blur-xl"
                 style={{ background: `linear-gradient(45deg, ${card.color.replace('from-', '').replace(' to-', ', ')})` }}
            />
            <div className="relative flex gap-4 items-center justify-between p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:border-transparent">
              <div className="relative z-10">
                <h1 className="text-sm text-gray-600 mb-1">{card.title}</h1>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <div className="flex items-center gap-2 mt-2">
                  <FiTrendingUp className="text-green-500" />
                  <span className="text-xs text-green-600 font-medium">+12% from last month</span>
                </div>
              </div>

              <div className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                {card.iconComponent}
              </div>

              {/* Animated background effect */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                   style={{ background: `linear-gradient(45deg, ${card.color.replace('from-', '').replace(' to-', ', ')})` }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex flex-col lg:flex-row items-start gap-6 mb-8 w-full">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 flex-1 max-w-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Recent Bookings</h1>
              <p className="text-gray-500 text-sm">Latest customer bookings</p>
            </div>
            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
              {data.recentBookings.length} Active
            </div>
          </div>

          <AnimatePresence>
            {data.recentBookings.map((booking, index) => (
              <motion.div
                key={booking._id || index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: index * 0.05 }}
                className="mt-4 flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 shadow-sm group-hover:shadow transition-shadow duration-300">
                    <img src={assets.listIconColored} alt="" className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="font-medium text-gray-800 group-hover:text-primary transition-colors duration-200">
                      {booking.car.name} {booking.car.model}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <span className="text-gray-300">•</span>
                      <p className="text-sm text-gray-500">{booking.customer.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-gray-800">
                    {currency}{booking.price}
                  </p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : booking.status === 'pending'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Revenue & Stats */}
        <div className="flex flex-col gap-6 w-full lg:w-96">
          {/* Monthly Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold">Monthly Revenue</h1>
                <p className="text-blue-100 text-sm">Revenue for current month</p>
              </div>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <BsGraphUpArrow className="text-2xl" />
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold mb-2">{currency}{data.monthlyRevenue}</p>
                <div className="flex items-center gap-2">
                  <FiTrendingUp className="text-green-300" />
                  <span className="text-green-300 text-sm font-medium">+{data.revenueGrowth}% from last month</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">↑</div>
                <p className="text-blue-100 text-sm">Trending Up</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <FiCheckCircle className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg. Booking Value</p>
                    <p className="font-semibold text-gray-800">{currency}450</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">+8.2%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FiCalendar className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg. Response Time</p>
                    <p className="font-semibold text-gray-800">2.4 hrs</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-600">-12%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <FiDollarSign className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="font-semibold text-gray-800">68.5%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-600">+5.3%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add this if you want animated notifications */}
      {data.pendingBookings > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 p-4 bg-white rounded-xl shadow-lg border border-gray-200 max-w-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <FiClock className="text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Pending Bookings</p>
              <p className="text-sm text-gray-600">You have {data.pendingBookings} bookings waiting for approval</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Dashboard
