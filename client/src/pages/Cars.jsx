import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard.jsx'
import Title from '../components/Title.jsx'
import { useAppContext } from '../context/AppContext'

const Cars = () => {

  // ==================================
  // 🔍 Récupération des paramètres URL
  // ==================================
  const [searchParams] = useSearchParams()

  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')

  // Si les 3 infos existent → recherche backend
  const isSearchData = pickupLocation && pickupDate && returnDate

  // ==================================
  // 🌍 Données globales (Context)
  // ==================================
  const { cars = [], axios } = useAppContext()

  // ==================================
  // 🧠 États locaux
  // ==================================
  const [input, setInput] = useState('')
  const [filteredCars, setFilteredCars] = useState([])

  // ==================================
  // 🚗 Vérification de disponibilité (BACKEND)
  // ==================================
  const searchCarAvailablity = async () => {
    try {
      const { data } = await axios.post(
        '/api/bookings/check-availability',
        {
          location: pickupLocation,
          pickupDate,
          returnDate,
        }
      )

      // Sécurité maximale
      if (!data || !data.success) return

      const availableCars = data.availableCars || []

      setFilteredCars(availableCars)

      if (availableCars.length === 0) {
        toast('No cars available')
      }

    } catch (error) {
      console.error(error)
      toast.error('Error while checking availability')
    }
  }

  // ==================================
  // 🔎 Filtrage frontend (INPUT SEARCH)
  // ==================================
  const applyFilter = () => {
    if (!cars || cars.length === 0) return

    // Input vide → on affiche tout
    if (input.trim() === '') {
      setFilteredCars(cars)
      return
    }

    const filtered = cars.filter((car) =>
      car.brand?.toLowerCase().includes(input.toLowerCase()) ||
      car.model?.toLowerCase().includes(input.toLowerCase()) ||
      car.category?.toLowerCase().includes(input.toLowerCase()) ||
      car.transmission?.toLowerCase().includes(input.toLowerCase()) ||
      car.fuelType?.toLowerCase().includes(input.toLowerCase())
    )

    setFilteredCars(filtered)
  }

  // ==================================
  // 🧩 Effet : données initiales
  // ==================================
  useEffect(() => {
    // Si pas de recherche backend → affichage de tous les cars
    if (!isSearchData && cars.length > 0) {
      setFilteredCars(cars)
    }
  }, [cars, isSearchData])

  // ==================================
  // 🧩 Effet : recherche backend
  // ==================================
  useEffect(() => {
    if (!isSearchData) return
    if (cars.length === 0) return

    searchCarAvailablity()
  }, [isSearchData, cars])

  // ==================================
  // 🧩 Effet : filtre input
  // ==================================
  useEffect(() => {
    if (!isSearchData) {
      applyFilter()
    }
  }, [input])

  // ==================================
  // 🎨 UI
  // ==================================
  return (
    <div className="w-full">

      {/* --------- Header --------- */}
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles for your next adventure"
        />
      </div>

      {/* --------- Search Bar --------- */}
      <div className="w-full flex justify-center mt-6 px-4">
        <div className="flex items-center gap-3 bg-white px-5 max-w-140 w-full h-14 rounded-full shadow-lg">

          <img
            src={assets.search_icon}
            alt="search"
            className="w-5 h-5 opacity-60"
          />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by make, model or features"
            className="w-full h-full outline-none text-gray-600"
          />

          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <img
              src={assets.filter_icon}
              alt="filter"
              className="w-5 h-5 opacity-70"
            />
          </button>
        </div>
      </div>

      {/* --------- Cars Grid --------- */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">

        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars.length} Cars
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {filteredCars.map((car, index) => (
            <CarCard key={index} car={car} />
          ))}
        </div>

      </div>
    </div>
  )
}

export default Cars
