import React, { useEffect, useState, useCallback } from 'react';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const ManageBookings = () => {
  const { axios, currency } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState(null);

  const handleError = (error) => {
    const message = error?.response?.data?.message || error.message || 'Something went wrong';
    toast.error(message);
    console.error("API Error:", error); // console log pour les erreurs
  };

  const fetchOwnerBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("Fetching bookings..."); // debug
      const { data } = await axios.get('/api/bookings/owner');
      console.log("Response from API:", data); // debug
      if (data.success) {
        console.log("Bookings fetched successfully:", data.bookings); // debug
        setBookings(data.bookings || []);
      } else {
        toast.error(data.message);
        console.warn("API returned success=false:", data.message); // debug
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
      console.log(`Changing status of booking ${bookingId} to ${status}`); // debug
      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status });
      console.log("Change status response:", data); // debug
      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setStatusLoadingId(null);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, [fetchOwnerBookings]);

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking status."
      />

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium'>Date Range</th>
              <th className='p-3 font-medium'>Total</th>
              <th className='p-3 font-medium'>Payment</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">Loading bookings...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">No bookings found</td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id} className='border-t border-borderColor text-gray-500'>
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={booking.car?.image || '/fallback-car.png'}
                      alt={booking.car?.model || 'Car'}
                      className="h-12 w-12 aspect-square rounded-md object-cover"
                    />
                    <p className="font-medium max-md:hidden">
                      {booking.car?.brand} {booking.car?.model}
                    </p>
                  </td>

                  <td className="p-3 max-md:hidden">
                    {booking.pickupDate?.split('T')[0]} to {booking.returnDate?.split('T')[0]}
                  </td>

                  <td className="p-3">
                    {currency} {booking.price || '0'}
                  </td>

                  <td className="p-3 max-md:hidden">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">offline</span>
                  </td>

                  <td className="p-3">
                    {booking.status === 'pending' ? (
                      <select
                        value={booking.status}
                        disabled={statusLoadingId === booking._id}
                        onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                        className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none'
                      >
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancel</option>
                        <option value="confirmed">Confirm</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-500'
                            : 'bg-red-100 text-red-500'
                        }`}
                      >
                        {booking.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
