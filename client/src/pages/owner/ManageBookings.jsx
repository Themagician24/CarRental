import React, { useEffect, useState, useCallback } from 'react';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Car,
  DollarSign,
  RefreshCw,
  Filter,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const ManageBookings = () => {
  const { axios, currency } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedBooking, setExpandedBooking] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Status', icon: Filter, color: 'gray' },
    { value: 'pending', label: 'Pending', icon: Clock, color: 'yellow' },
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'green' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'red' },
  ];

  const handleError = (error) => {
    const message = error?.response?.data?.message || error.message || 'Something went wrong';
    toast.error(message);
    console.error("API Error:", error);
  };

  const fetchOwnerBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/api/bookings/owner');
      if (data.success) {
        const sortedBookings = [...(data.bookings || [])].sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBookings(sortedBookings);
        setFilteredBookings(sortedBookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [axios]);

  const changeBookingStatus = async (bookingId, status) => {
    try {
      setStatusLoadingId(bookingId);
      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status });
      if (data.success) {
        toast.success(data.message);

        // Update locally for instant feedback
        setBookings(prev => prev.map(booking =>
          booking._id === bookingId
            ? { ...booking, status, updatedAt: new Date().toISOString() }
            : booking
        ));

        // Refresh full data after a delay
        setTimeout(() => fetchOwnerBookings(), 500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setStatusLoadingId(null);
    }
  };

  const applyFilters = useCallback(() => {
    let result = [...bookings];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(booking =>
        booking.car?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.car?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking._id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(booking => booking.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        default:
          return 0;
      }
    });

    setFilteredBookings(result);
  }, [bookings, searchTerm, statusFilter, sortBy]);

  const toggleBookingExpand = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'pending':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      case 'cancelled':
        return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, [fetchOwnerBookings]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className='px-4 pt-10 md:px-10 w-full min-h-screen bg-gradient-to-br from-gray-50 to-white'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          title="Manage Bookings"
          subTitle="Track all customer bookings, approve or cancel requests, and manage booking status."
        />
      </motion.div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by car or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200 bg-white"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Bookings</p>
                <p className="text-2xl font-bold text-blue-700">{bookings.length}</p>
              </div>
              <Calendar className="h-10 w-10 text-blue-400" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Confirmed</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <CheckCircle className="h-10 w-10 text-emerald-400" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-amber-700">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-10 w-10 text-amber-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <RefreshCw className="h-12 w-12 text-blue-500 animate-spin" />
              <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings found</h3>
            <p className="text-gray-500">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredBookings.map((booking) => {
                const statusColor = getStatusColor(booking.status);
                const isExpanded = expandedBooking === booking._id;

                return (
                  <motion.div
                    key={booking._id}
                    variants={rowVariants}
                    layout
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Main Row */}
                    <div
                      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => toggleBookingExpand(booking._id)}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        {/* Car Info */}
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img
                              src={booking.car?.image || '/fallback-car.png'}
                              alt={booking.car?.model || 'Car'}
                              className="h-16 w-16 rounded-xl object-cover ring-2 ring-white shadow-md"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow">
                              <Car className="h-4 w-4 text-blue-500" />
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {booking.car?.brand} {booking.car?.model}
                            </p>
                            <p className="text-sm text-gray-500">
                              Booking ID: {booking._id?.slice(-8)}
                            </p>
                          </div>
                        </div>

                        {/* Date Range */}
                        <div className="md:text-center">
                          <Calendar className="h-5 w-5 text-gray-400 mb-1 mx-auto md:mx-0 md:inline mr-2" />
                          <span className="text-sm font-medium text-gray-700">
                            {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
                          </span>
                        </div>

                        {/* Total Price */}
                        <div className="md:text-center">
                          <DollarSign className="h-5 w-5 text-gray-400 mb-1 mx-auto md:mx-0 md:inline mr-2" />
                          <span className="text-lg font-bold text-gray-800">
                            {currency} {booking.price?.toLocaleString() || '0'}
                          </span>
                        </div>

                        {/* Payment Status */}
                        <div className="md:text-center">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                            {booking.paymentMethod || 'Offline'}
                          </span>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex items-center justify-between md:justify-end space-x-4">
                          {booking.status === 'pending' ? (
                            <div className="relative group">
                              <select
                                value={booking.status}
                                disabled={statusLoadingId === booking._id}
                                onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                                className="px-4 py-2 border-2 border-amber-200 rounded-xl bg-white text-amber-700 font-medium focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none pr-10"
                              >
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancel</option>
                                <option value="confirmed">Confirm</option>
                              </select>
                              {statusLoadingId === booking._id && (
                                <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-amber-500" />
                              )}
                            </div>
                          ) : (
                            <span className={`inline-flex items-center px-4 py-2 rounded-xl font-semibold ${statusColor.bg} ${statusColor.text} ${statusColor.border} border`}>
                              {booking.status === 'confirmed' && <CheckCircle className="h-4 w-4 mr-2" />}
                              {booking.status === 'cancelled' && <XCircle className="h-4 w-4 mr-2" />}
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          )}
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-100"
                        >
                          <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-500 mb-3">CUSTOMER DETAILS</h4>
                                <div className="space-y-2">
                                  <p className="text-gray-700">
                                    <span className="font-medium">Name:</span> {booking.user?.name || 'N/A'}
                                  </p>
                                  <p className="text-gray-700">
                                    <span className="font-medium">Email:</span> {booking.user?.email || 'N/A'}
                                  </p>
                                  <p className="text-gray-700">
                                    <span className="font-medium">Phone:</span> {booking.user?.phone || 'N/A'}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-500 mb-3">BOOKING INFORMATION</h4>
                                <div className="space-y-2">
                                  <p className="text-gray-700">
                                    <span className="font-medium">Created:</span> {formatDate(booking.createdAt)}
                                  </p>
                                  <p className="text-gray-700">
                                    <span className="font-medium">Days:</span> {booking.days || 'N/A'} days
                                  </p>
                                  <p className="text-gray-700">
                                    <span className="font-medium">Pickup Location:</span> {booking.pickupLocation || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      {/* Refresh Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 flex justify-center"
      >
        <button
          onClick={fetchOwnerBookings}
          disabled={isLoading}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Bookings
        </button>
      </motion.div>
    </div>
  );
};

export default ManageBookings;
