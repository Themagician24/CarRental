import axios from 'axios'
import { toast } from 'react-hot-toast'

// Attach a global response interceptor to normalize errors and show toasts
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const message = error?.response?.data?.message || error?.message || 'Une erreur est survenue'
      // show a friendly toast
      toast.error(message)
    } catch (e) {
      console.error('Error in axios interceptor', e)
    }
    return Promise.reject(error)
  }
)

export default axios
