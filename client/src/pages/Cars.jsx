import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard.jsx'
import { motion, AnimatePresence } from 'motion/react'
import { useAppContext } from '../context/AppContext'

const FILTERS = ['Tous', 'Électrique', 'Hybride', 'Diesel', 'Essence']

const Cars = () => {
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')
  const isSearchData = pickupLocation && pickupDate && returnDate

  const { cars = [], axios } = useAppContext()

  const [input, setInput] = useState('')
  const [activeFilter, setActiveFilter] = useState('Tous')
  const [filteredCars, setFilteredCars] = useState([])

  const searchCarAvailability = async () => {
    try {
      const { data } = await axios.post('/api/bookings/check-availability', {
        location: pickupLocation,
        pickupDate,
        returnDate,
      })
      if (!data?.success) return
      const available = data.availableCars || []
      setFilteredCars(available)
      if (available.length === 0) toast('Aucune voiture disponible pour ces critères')
    } catch (error) {
      console.error(error)
      toast.error('Erreur lors de la vérification de disponibilité')
    }
  }

  const applyFilter = () => {
    if (!cars.length) return
    let results = [...cars]

    if (activeFilter !== 'Tous') {
      results = results.filter(c =>
        c.fuel_type?.toLowerCase() === activeFilter.toLowerCase() ||
        (activeFilter === 'Électrique' && c.fuel_type?.toLowerCase() === 'electric')
      )
    }

    if (input.trim()) {
      const q = input.toLowerCase()
      results = results.filter(c =>
        c.brand?.toLowerCase().includes(q) ||
        c.model?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.transmission?.toLowerCase().includes(q) ||
        c.fuel_type?.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q)
      )
    }

    setFilteredCars(results)
  }

  useEffect(() => {
    if (!isSearchData && cars.length > 0) setFilteredCars(cars)
  }, [cars, isSearchData])

  useEffect(() => {
    if (isSearchData && cars.length > 0) searchCarAvailability()
  }, [isSearchData, cars])

  useEffect(() => {
    if (!isSearchData) applyFilter()
  }, [input, activeFilter, cars])

  const evCount = cars.filter(c => c.fuel_type?.toLowerCase() === 'electric').length

  return (
    <div className="min-h-screen bg-white">

      {/* ── Page Header (dark) ── */}
      <div className="relative bg-[#07071a] overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-grid opacity-100" />
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-[#7c3aed]/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {filteredCars.length} véhicule{filteredCars.length !== 1 ? 's' : ''} disponibles
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Notre <span className="gradient-text">Flotte</span>
          </h1>
          <p className="text-gray-400">Trouvez le véhicule parfait pour votre prochain trajet</p>
        </motion.div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-4 flex flex-col sm:flex-row items-center gap-4">

          {/* Search bar */}
          <div className="relative flex-1 w-full sm:max-w-xs">
            <img src={assets.search_icon} alt="" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Marque, modèle, lieu..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => {
              const isEV = f === 'Électrique'
              const active = activeFilter === f
              return (
                <motion.button
                  key={f}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200
                    ${active
                      ? isEV
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-linear-to-r from-primary to-[#7c3aed] text-white shadow-md shadow-primary/20'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                >
                  {isEV ? `⚡ ${f}` : f}
                  {isEV && evCount > 0 && !active && (
                    <span className="ml-1.5 bg-emerald-100 text-emerald-600 text-[10px] px-1.5 py-0.5 rounded-full">
                      {evCount}
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">

        {/* Info bar */}
        <motion.div
          layout
          className="flex items-center justify-between mb-8"
        >
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{filteredCars.length}</span> véhicule{filteredCars.length !== 1 ? 's' : ''}
            {isSearchData && <span className="ml-2 text-primary text-xs font-medium">· filtrés par disponibilité</span>}
            {activeFilter !== 'Tous' && <span className="ml-2 text-xs font-medium text-gray-400">· {activeFilter}</span>}
          </p>
        </motion.div>

        {/* Grid or empty state */}
        <AnimatePresence mode="wait">
          {filteredCars.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center py-28 text-gray-400"
            >
              <div className="text-6xl mb-4">🚗</div>
              <p className="text-xl font-semibold text-gray-700 mb-2">Aucun véhicule trouvé</p>
              <p className="text-sm">Essayez d'ajuster vos critères de recherche</p>
              <button
                onClick={() => { setInput(''); setActiveFilter('Tous') }}
                className="mt-6 px-5 py-2 rounded-xl border border-primary/30 text-primary text-sm hover:bg-primary/5 transition-all"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredCars.map((car, i) => (
                <CarCard key={car._id} car={car} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Cars
