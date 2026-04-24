import { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'motion/react'
import { dummyMyBookingsData } from '../assets/assets.js'

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmée', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  pending:   { label: 'En attente', bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400'  },
  cancelled: { label: 'Annulée',   bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-400'    },
}

const PHASE_CONFIG = {
  'À venir':   { bg: 'bg-blue-50',  text: 'text-blue-600'  },
  'En cours':  { bg: 'bg-primary/8', text: 'text-primary'   },
  'Terminée':  { bg: 'bg-gray-100', text: 'text-gray-500'  },
}

const MyBookings = () => {
  const { axios, user, currency } = useAppContext()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMyBookings = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/bookings/user')
      if (data.success) {
        setBookings(data.bookings)
      } else {
        setBookings(dummyMyBookingsData)
      }
    } catch {
      setBookings(dummyMyBookingsData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchMyBookings()
    else setLoading(false)
  }, [user])

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })

  const getDays = (s, e) =>
    Math.max(1, Math.ceil((new Date(e) - new Date(s)) / 86400000))

  const getPhase = (pickup, ret) => {
    const now = new Date()
    if (now < new Date(pickup)) return 'À venir'
    if (now > new Date(ret))    return 'Terminée'
    return 'En cours'
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Header ── */}
      <div className="relative bg-[#07071a] overflow-hidden py-16 px-6">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {loading ? '…' : `${bookings.length} réservation${bookings.length !== 1 ? 's' : ''}`}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Mes <span className="gradient-text">Réservations</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Suivez et gérez toutes vos locations</p>
        </motion.div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">

        {/* Not logged in */}
        {!user && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-24 text-center"
          >
            <div className="text-6xl mb-5">🔐</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Connexion requise</h2>
            <p className="text-gray-500 text-sm mb-6">Connectez-vous pour voir vos réservations</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-xl bg-linear-to-r from-primary to-[#7c3aed] text-white text-sm font-semibold shadow-[0_0_20px_rgba(0,212,255,0.25)] hover:shadow-[0_0_35px_rgba(0,212,255,0.4)] transition-shadow"
            >
              Retour à l'accueil
            </button>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && user && bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-24 text-center"
          >
            <div className="text-6xl mb-5">🚗</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Aucune réservation</h2>
            <p className="text-gray-500 text-sm mb-6">Votre prochain voyage commence ici</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/cars')}
              className="px-6 py-2.5 rounded-xl bg-linear-to-r from-primary to-[#7c3aed] text-white text-sm font-semibold shadow-[0_0_20px_rgba(0,212,255,0.25)] hover:shadow-[0_0_35px_rgba(0,212,255,0.4)] transition-shadow"
            >
              Explorer les véhicules
            </motion.button>
          </motion.div>
        )}

        {/* Bookings list */}
        <AnimatePresence>
          {!loading && bookings.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
              className="space-y-5"
            >
              {bookings.map((b) => {
                const days = getDays(b.pickupDate, b.returnDate)
                const phase = getPhase(b.pickupDate, b.returnDate)
                const status = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending
                const phaseStyle = PHASE_CONFIG[phase] || PHASE_CONFIG['Terminée']

                return (
                  <motion.div
                    key={b._id}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-0">

                      {/* Car image */}
                      <div className="relative h-44 md:h-auto overflow-hidden md:rounded-l-2xl bg-gray-50">
                        <img
                          src={b.car.image}
                          alt={`${b.car.brand} ${b.car.model}`}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent md:bg-linear-to-r" />
                      </div>

                      {/* Info */}
                      <div className="p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                              {status.label}
                            </span>
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${phaseStyle.bg} ${phaseStyle.text}`}>
                              {phase}
                            </span>
                            <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                              #{b._id.slice(-6).toUpperCase()}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-gray-900">{b.car.brand} {b.car.model}</h3>
                          <p className="text-sm text-gray-400">{b.car.year} · {b.car.category}</p>
                        </div>

                        {/* Dates */}
                        <div className="mt-4 flex items-center gap-6">
                          <div>
                            <div className="text-[11px] text-gray-400 font-medium mb-0.5">Départ</div>
                            <div className="text-sm font-semibold text-gray-800">{formatDate(b.pickupDate)}</div>
                          </div>
                          <div className="flex-1 h-px bg-linear-to-r from-primary/30 to-transparent max-w-[60px]" />
                          <div className="text-xs text-primary font-bold">{days}j</div>
                          <div className="flex-1 h-px bg-linear-to-l from-primary/30 to-transparent max-w-[60px]" />
                          <div>
                            <div className="text-[11px] text-gray-400 font-medium mb-0.5">Retour</div>
                            <div className="text-sm font-semibold text-gray-800">{formatDate(b.returnDate)}</div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                          <span>📍 {b.car.location}</span>
                          <span>🛡️ Assurance incluse</span>
                          <span>💳 Paiement en ligne</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="px-6 py-5 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col items-end justify-between min-w-[140px]">
                        <div className="text-right">
                          <div className="text-xs text-gray-400 mb-1">Total</div>
                          <div className="text-3xl font-black text-gray-900">{currency}{b.price}</div>
                          <div className="text-xs text-gray-400 mt-1">{currency}{(b.price / days).toFixed(0)} / jour</div>
                        </div>
                        <div className="text-right mt-4">
                          <div className="text-[11px] text-gray-400">Réservé le</div>
                          <div className="text-xs font-medium text-gray-600">{formatDate(b.createdAt)}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MyBookings
