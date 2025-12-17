import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard.jsx'
import Title from '../components/Title.jsx'
import { useAppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

const Cars = () => {
  // ==================================
  // 🔍 Récupération des paramètres URL
  // ==================================
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')
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
  const [selectedCar, setSelectedCar] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentAngle, setCurrentAngle] = useState(0)
  const [show3DViewer, setShow3DViewer] = useState(false)

  // Angles disponibles pour la vue 3D
  const angles = ['front', 'side', 'rear', 'interior', 'engine', 'top']

  // ==================================
  // 🚗 Vérification de disponibilité
  // ==================================
  const searchCarAvailability = async () => {
    try {
      const { data } = await axios.post(
        '/api/bookings/check-availability',
        {
          location: pickupLocation,
          pickupDate,
          returnDate,
        }
      )

      if (!data || !data.success) return

      const availableCars = data.availableCars || []
      setFilteredCars(availableCars)

      if (availableCars.length === 0) {
        toast.custom((t) => (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-lg border border-red-500/30 text-white px-6 py-4 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">No Cars Available</p>
                <p className="text-sm opacity-80">Try different dates or location</p>
              </div>
            </div>
          </motion.div>
        ))
      }
    } catch (error) {
      console.error(error)
      toast.error('Error while checking availability')
    }
  }

  // ==================================
  // 🔎 Filtrage avancé
  // ==================================
  const applyFilter = (filterType = 'all') => {
    if (!cars || cars.length === 0) return

    let filtered = [...cars]

    // Filtre par catégorie
    if (filterType !== 'all') {
      filtered = filtered.filter(car => car.category?.toLowerCase() === filterType)
    }

    // Filtre par recherche textuelle
    if (input.trim() !== '') {
      filtered = filtered.filter((car) =>
        car.brand?.toLowerCase().includes(input.toLowerCase()) ||
        car.model?.toLowerCase().includes(input.toLowerCase()) ||
        car.category?.toLowerCase().includes(input.toLowerCase()) ||
        car.transmission?.toLowerCase().includes(input.toLowerCase()) ||
        car.fuelType?.toLowerCase().includes(input.toLowerCase())
      )
    }

    setFilteredCars(filtered)
    setActiveFilter(filterType)
  }

  // ==================================
  // 🎨 Effets d'initialisation
  // ==================================
  useEffect(() => {
    if (!isSearchData && cars.length > 0) {
      setFilteredCars(cars)
    }
  }, [cars, isSearchData])

  useEffect(() => {
    if (!isSearchData) return
    if (cars.length === 0) return
    searchCarAvailability()
  }, [isSearchData, cars])

  useEffect(() => {
    if (!isSearchData) {
      applyFilter(activeFilter)
    }
  }, [input])

  // ==================================
  // 🖼️ Gestionnaire de vue 3D
  // ==================================
  const handleOpen3DViewer = (car) => {
    setSelectedCar(car)
    setCurrentAngle(0)
    setShow3DViewer(true)
  }

  const handleAngleChange = (direction) => {
    if (direction === 'next') {
      setCurrentAngle((prev) => (prev + 1) % angles.length)
    } else {
      setCurrentAngle((prev) => (prev - 1 + angles.length) % angles.length)
    }
  }

  // ==================================
  // 🎨 UI - Design ultra moderne
  // ==================================
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">

      {/* 🌟 En-tête avec effet de particules */}
      <div className="relative py-24 overflow-hidden">
        {/* Effet de particules */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
              initial={{ x: Math.random() * 100 + 'vw', y: Math.random() * 100 + 'vh' }}
              animate={{
                x: [null, Math.random() * 100 + 'vw'],
                y: [null, Math.random() * 100 + 'vh'],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Title
              title="Premium Fleet Collection"
              subTitle="Experience luxury and performance from every angle"
            />
          </motion.div>

          {/* Badge de recherche active */}
          {isSearchData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 backdrop-blur-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl px-6 py-3"
            >
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/20 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">{pickupLocation}</span>
                </div>
                <div className="h-4 w-px bg-blue-500/30" />
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-500/20 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium">{pickupDate} → {returnDate}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 🔍 Barre de recherche moderne */}
      <div className="relative z-20 -mt-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative group">
            {/* Effet de halo */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

            <div className="relative flex items-center bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 px-6 h-16 rounded-2xl">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search by brand, model, category, or features..."
                className="flex-1 h-full bg-transparent outline-none px-4 text-white placeholder-gray-400"
              />

              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-800/50 rounded-xl transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </button>
                <button className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Filtres rapides */}
          <div className="flex flex-wrap gap-3 mt-6">
            {['all', 'suv', 'sedan', 'sports', 'luxury', 'electric'].map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => applyFilter(filter)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-orange-600 to-yellow-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 📊 Compteur de résultats */}
      <div className="px-4 mt-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {filteredCars.length} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Premium Vehicles</span>
              </h3>
              <p className="text-gray-400">Available for your journey</p>
            </div>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* 🚗 Grille de voitures avec animations */}
      <div className="px-4 pb-20 max-w-7xl mx-auto">
        <AnimatePresence>
          {filteredCars.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Cars Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search criteria or explore all available vehicles
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredCars.map((car, index) => (
                <motion.div
                  key={car._id || index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative"
                >
                  <CarCard
                    car={car}
                    onView3D={() => handleOpen3DViewer(car)}
                  />

                  {/* Badge de nouveauté */}
                  {car.isNew && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
                        NEW
                      </div>
                    </div>
                  )}

                  {/* Effet de hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/0 via-transparent to-transparent opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🖼️ Modal de vue 3D (multi-angles) */}
      <AnimatePresence>
        {show3DViewer && selectedCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
            onClick={() => setShow3DViewer(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden border border-gray-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* En-tête du modal */}
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedCar.brand} {selectedCar.model}
                  </h3>
                  <p className="text-gray-400">{selectedCar.category} • {selectedCar.year}</p>
                </div>
                <button
                  onClick={() => setShow3DViewer(false)}
                  className="p-2 hover:bg-gray-800 rounded-xl transition-all duration-300"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contenu du modal - Vue multi-angles */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Vue principale */}
                  <div className="lg:col-span-2">
                    <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                      {/* Image principale */}
                      <motion.img
                        key={currentAngle}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        src={selectedCar.images?.[currentAngle] || selectedCar.image}
                        alt={`${selectedCar.brand} ${selectedCar.model} - ${angles[currentAngle]} view`}
                        className="w-full h-full object-cover"
                      />

                      {/* Contrôles d'angle */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                        <button
                          onClick={() => handleAngleChange('prev')}
                          className="p-3 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-all duration-300 hover:scale-110"
                        >
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        <div className="px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full">
                          <span className="text-white font-medium capitalize">
                            {angles[currentAngle]} View
                          </span>
                        </div>

                        <button
                          onClick={() => handleAngleChange('next')}
                          className="p-3 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-all duration-300 hover:scale-110"
                        >
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Miniatures et informations */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">View Angles</h4>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {angles.map((angle, index) => (
                        <motion.button
                          key={angle}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentAngle(index)}
                          className={`relative aspect-video rounded-xl overflow-hidden ${
                            currentAngle === index
                              ? 'ring-2 ring-orange-500'
                              : 'opacity-60 hover:opacity-100'
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <img
                            src={selectedCar.images?.[index] || selectedCar.image}
                            alt={angle}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2">
                            <span className="text-xs font-medium text-white capitalize">
                              {angle}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Spécifications */}
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl">
                        <h5 className="text-sm font-medium text-gray-400 mb-2">Specifications</h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-500">Engine</p>
                            <p className="font-medium text-white">{selectedCar.engine || 'V8 4.0L'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Power</p>
                            <p className="font-medium text-white">{selectedCar.power || '500 HP'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Transmission</p>
                            <p className="font-medium text-white capitalize">{selectedCar.transmission}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Fuel Type</p>
                            <p className="font-medium text-white capitalize">{selectedCar.fuelType}</p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300">
                        Book Now - ${selectedCar.price}/day
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Cars
