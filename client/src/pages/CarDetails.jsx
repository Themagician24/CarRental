import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { assets } from '../assets/assets.js'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'motion/react'

/* ─── Gallery photos (different angles / moods) ─── */
const BASE_GALLERY = [
  assets.gallery_interior,
  assets.gallery_profile,
  assets.gallery_rear,
  assets.gallery_night,
]

/* ─── Premium equipment list ─── */
const FEATURES = [
  { icon: "◉", title: "Caméra 360°",          desc: "Vision périmétrique complète"      },
  { icon: "◉", title: "Apple CarPlay",         desc: "Intégration smartphone native"     },
  { icon: "◉", title: "Burmester® Surround",   desc: "Système audio 3D haute-fidélité"  },
  { icon: "◉", title: "Climatisation 4 zones", desc: "Régulation automatique par zone"   },
  { icon: "◉", title: "Sièges Massage",        desc: "Chauffants, ventilés, massants"    },
  { icon: "◉", title: "Assistance conduite",   desc: "Suite de sécurité active avancée" },
  { icon: "◉", title: "Éclairage ambiance",    desc: "64 coloris personnalisables"       },
  { icon: "◉", title: "Charge sans fil",       desc: "Recharge rapide Qi intégrée"      },
]

export default function CarDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate, user, setShowLogin } = useAppContext()
  const currency = import.meta.env.VITE_CURRENCY || '€'

  const [car, setCar]         = useState(null)
  const [active, setActive]   = useState(0)
  const [booking, setBooking] = useState(false)

  const isEV = car?.fuel_type?.toLowerCase() === 'electric'
  const gallery = car ? [car.image, ...BASE_GALLERY] : BASE_GALLERY

  const days  = (pickupDate && returnDate)
    ? Math.max(0, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / 86400000))
    : 0
  const total = days * (car?.pricePerDay || 0)

  useEffect(() => {
    const found = cars.find(c => c._id === id)
    if (found) { setCar(found); setActive(0) }
  }, [cars, id])

  const handleBook = async (e) => {
    e.preventDefault()
    if (!user) { setShowLogin(true); return }
    setBooking(true)
    try {
      const { data } = await axios.post('/api/bookings/create', { car: id, pickupDate, returnDate })
      if (data.success) {
        toast.success('Réservation confirmée !')
        setTimeout(() => navigate('/my-bookings'), 1400)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la réservation')
    } finally {
      setBooking(false)
    }
  }

  /* ── Loading ── */
  if (!car) return (
    <div className="min-h-screen bg-[#07071a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Chargement du véhicule…</p>
      </div>
    </div>
  )

  /* ── SPECS for the horizontal strip ── */
  const specs = isEV
    ? [
        { label: 'AUTONOMIE',  value: `${car.range_km} km` },
        { label: 'RECHARGE',   value: car.charge_time?.split(' ')[0] ?? '—' },
        { label: 'BATTERIE',   value: `${car.battery_kwh} kWh` },
        { label: 'PLACES',     value: `${car.seating_capacity}` },
        { label: 'BOÎTE',      value: car.transmission },
        { label: 'CATÉGORIE',  value: car.category },
      ]
    : [
        { label: 'PUISSANCE',  value: '450 ch' },
        { label: '0–100',      value: '4.2 s' },
        { label: 'VIT. MAX',   value: '250 km/h' },
        { label: 'PLACES',     value: `${car.seating_capacity}` },
        { label: 'BOÎTE',      value: car.transmission },
        { label: 'CATÉGORIE',  value: car.category },
      ]

  return (
    <div className="min-h-screen bg-white">

      {/* ════════════════════════════════════════
          01 · FULL-BLEED HERO
      ════════════════════════════════════════ */}
      <div className="relative h-[88vh] min-h-[560px] overflow-hidden">

        {/* Background image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={gallery[active]}
            alt={`${car.brand} ${car.model}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Gradient overlays — bottom heavy */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/30" />
        <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent" />

        {/* ── Top bar ── */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 md:px-14 pt-8">
          <motion.button
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/20 transition-all duration-200"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </motion.button>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            {isEV && (
              <span className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                ⚡ Électrique
              </span>
            )}
            <span className="bg-white/10 border border-white/20 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
              {car.isAvailable !== false ? '● Disponible' : '○ Indisponible'}
            </span>
          </motion.div>
        </div>

        {/* ── Bottom info ── */}
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-14 pb-10 flex items-end justify-between">

          {/* Car name */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase mb-1">
              {car.category} · {car.year} · {car.location}
            </p>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight">
              {car.brand}
            </h1>
            <h2 className="text-3xl md:text-5xl font-light text-white/75 mt-1">
              {car.model}
            </h2>
          </motion.div>

          {/* Price chip */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-right"
          >
            <p className="text-white/50 text-[11px] font-semibold tracking-widest uppercase mb-1">À partir de</p>
            <p className="text-5xl md:text-6xl font-black text-white leading-none">
              {currency}{car.pricePerDay}
            </p>
            <p className="text-white/50 text-sm mt-1">par jour · TTC</p>
          </motion.div>
        </div>

        {/* ── Thumbnail strip (bottom right of hero) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute right-8 md:right-14 bottom-1/2 translate-y-1/2 flex flex-col gap-2"
        >
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-14 h-10 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                i === active
                  ? 'border-white shadow-[0_0_16px_rgba(255,255,255,0.4)] scale-105'
                  : 'border-white/20 hover:border-white/60 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </motion.div>
      </div>

      {/* ════════════════════════════════════════
          02 · HORIZONTAL SPEC STRIP
      ════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-[#07071a] border-b border-white/[0.06]"
      >
        <div className="max-w-7xl mx-auto px-8 md:px-14">
          <div className="flex items-center overflow-x-auto scrollbar-none divide-x divide-white/[0.08]">
            {specs.map((s) => (
              <div key={s.label} className="flex flex-col items-center px-8 py-5 shrink-0 min-w-[120px]">
                <span className="text-[10px] text-gray-500 font-semibold tracking-[0.15em] uppercase mb-1.5">{s.label}</span>
                <span className="text-sm font-bold text-white">{s.value}</span>
              </div>
            ))}
            <div className="flex flex-col items-center px-8 py-5 shrink-0 min-w-[120px]">
              <span className="text-[10px] text-gray-500 font-semibold tracking-[0.15em] uppercase mb-1.5">CARBURANT</span>
              <span className={`text-sm font-bold ${isEV ? 'text-emerald-400' : 'text-white'}`}>{car.fuel_type}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ════════════════════════════════════════
          03 · MAIN CONTENT
      ════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 md:px-14 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-14">

            {/* § Gallery grid */}
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-5">Galerie photos</p>
              <div className="grid grid-cols-3 gap-3">

                {/* Main large image */}
                <div className="col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group bg-gray-100">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={active}
                      src={gallery[active]}
                      alt=""
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  </AnimatePresence>
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {active + 1} / {gallery.length}
                  </div>
                </div>

                {/* Thumbnails column */}
                <div className="grid grid-rows-3 gap-3">
                  {gallery.slice(1, 4).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i + 1)}
                      className={`relative rounded-xl overflow-hidden bg-gray-100 transition-all duration-200 ${
                        active === i + 1
                          ? 'ring-2 ring-primary ring-offset-2'
                          : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover aspect-[4/3]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* § EV data */}
            {isEV && car.range_km && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-teal-50 p-6"
              >
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold tracking-widest text-emerald-700 uppercase">Données électriques</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    { v: `${car.range_km} km`, l: 'Autonomie' },
                    { v: car.charge_time,       l: 'Recharge DC' },
                    { v: `${car.battery_kwh} kWh`, l: 'Batterie' },
                  ].map(s => (
                    <div key={s.l}>
                      <div className="text-2xl font-black text-emerald-700">{s.v}</div>
                      <div className="text-xs text-emerald-500 mt-0.5">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.min((car.range_km / 700) * 100, 100)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: 'easeOut' }}
                    className="h-full rounded-full bg-linear-to-r from-emerald-400 to-teal-400"
                  />
                </div>
              </motion.div>
            )}

            {/* § Description */}
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-4">Description</p>
              <p className="text-gray-600 leading-[1.9] text-[15px]">{car.description}</p>
            </div>

            {/* § Equipment */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase">Équipements</p>
                <span className="text-xs font-bold text-primary bg-primary/8 px-3 py-1 rounded-full">{FEATURES.length} inclus</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
                {FEATURES.map((f) => (
                  <motion.div
                    key={f.title}
                    whileInView={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 p-5 bg-white hover:bg-gray-50 transition-colors duration-150 group"
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                      isEV
                        ? 'border-emerald-300 group-hover:border-emerald-500 group-hover:bg-emerald-50'
                        : 'border-primary/30 group-hover:border-primary group-hover:bg-primary/5'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${isEV ? 'bg-emerald-400' : 'bg-primary'} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{f.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{f.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* § Technical specs — dark */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#07071a] rounded-3xl overflow-hidden"
            >
              <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-gray-500 uppercase mb-1">Performance</p>
                <h3 className="text-xl font-bold text-white">Caractéristiques techniques</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-white/[0.06]">
                {(isEV
                  ? [
                      { label: 'Puissance', value: '530 ch' },
                      { label: '0–100 km/h', value: '3.4 s' },
                      { label: 'Vitesse max', value: '250 km/h' },
                      { label: 'Couple', value: '830 Nm' },
                      { label: 'Transmission', value: 'AWD' },
                      { label: 'Masse', value: '2 220 kg' },
                    ]
                  : [
                      { label: 'Puissance', value: '450 ch' },
                      { label: '0–100 km/h', value: '4.2 s' },
                      { label: 'Vitesse max', value: '250 km/h' },
                      { label: 'Couple', value: '550 Nm' },
                      { label: 'Transmission', value: 'AWD' },
                      { label: 'Masse', value: '1 850 kg' },
                    ]
                ).map((s) => (
                  <div key={s.label} className="px-6 py-5">
                    <div className="text-[10px] text-gray-600 tracking-wider uppercase mb-2">{s.label}</div>
                    <div className="text-xl font-black text-white">{s.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN — BOOKING ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="sticky top-24 space-y-4">

              {/* Booking card */}
              <div className="rounded-2xl border border-gray-100 shadow-[0_4px_32px_rgba(0,0,0,0.08)] overflow-hidden">

                {/* Header */}
                <div className="relative bg-[#07071a] px-6 pt-7 pb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-grid opacity-40" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                  <div className="relative">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-gray-500 uppercase mb-2">Tarif journalier</p>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-black text-white">{currency}{car.pricePerDay}</span>
                      <span className="text-gray-500 text-sm mb-1">/ jour</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Toutes taxes · assurance incluses</p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleBook} className="p-6 space-y-4 bg-white">

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase block mb-2">
                        Prise en charge
                      </label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={e => setPickupDate(e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/8 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase block mb-2">
                        Retour
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={e => setReturnDate(e.target.value)}
                        required
                        min={pickupDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/8 transition-all"
                      />
                    </div>
                  </div>

                  {/* Calculation */}
                  {days > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{currency}{car.pricePerDay} × {days} jour{days > 1 ? 's' : ''}</span>
                        <span className="text-gray-700 font-medium">{currency}{total}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between">
                        <span className="font-bold text-gray-900">Total estimé</span>
                        <span className="text-lg font-black text-primary">{currency}{total}</span>
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={booking}
                    whileHover={{ scale: booking ? 1 : 1.02 }}
                    whileTap={{ scale: booking ? 1 : 0.98 }}
                    className={`w-full py-4 rounded-xl font-bold text-sm text-white transition-all duration-300
                      ${isEV
                        ? 'bg-linear-to-r from-emerald-500 to-teal-500 shadow-[0_0_24px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.45)]'
                        : 'bg-linear-to-r from-primary to-[#7c3aed] shadow-[0_0_24px_rgba(0,212,255,0.2)] hover:shadow-[0_0_40px_rgba(0,212,255,0.45)]'
                      }
                      disabled:opacity-60`}
                  >
                    {booking ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Confirmation en cours…
                      </span>
                    ) : (
                      'Réserver ce véhicule'
                    )}
                  </motion.button>

                  <div className="flex items-center justify-center gap-6 pt-1">
                    <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Annulation gratuite
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Assurance incluse
                    </span>
                  </div>
                </form>
              </div>

              {/* Concierge */}
              <div className="rounded-2xl bg-[#07071a] border border-white/[0.06] p-5">
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Conciergerie 24h/7j</p>
                    <p className="text-xs text-gray-500">Service premium dédié</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Livraison à votre adresse, mise en route personnalisée et assistance permanente incluses dans chaque réservation.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
