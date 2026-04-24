import { useState, useEffect } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { motion, AnimatePresence } from 'motion/react'

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext()

  useEffect(() => { if (pickupDate) setStartDate(new Date(pickupDate)) }, [pickupDate])
  useEffect(() => { if (returnDate) setEndDate(new Date(returnDate)) }, [returnDate])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!pickupLocation || !startDate || !endDate) {
      alert('Veuillez remplir tous les champs')
      return
    }
    const fmt = (d) => d.toISOString().split('T')[0]
    navigate(`/cars?pickupLocation=${pickupLocation}&pickupDate=${fmt(startDate)}&returnDate=${fmt(endDate)}`)
  }

  const handleDateChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    if (start) setPickupDate(start.toISOString().split('T')[0])
    if (end) setReturnDate(end.toISOString().split('T')[0])
  }

  const calculateDays = () => {
    if (!startDate || !endDate) return 0
    return Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24))
  }

  const quickOptions = [
    { label: 'Aujourd\'hui', days: 0 },
    { label: 'Demain', days: 1 },
    { label: 'Week-end', days: getDaysUntilWeekend() },
    { label: 'Semaine prochaine', days: 7 },
  ]

  return (
    <section className="relative min-h-[calc(100vh-72px)] flex flex-col items-center justify-center overflow-hidden bg-[#07071a] text-center">

      {/* ── Animated grid background ── */}
      <div className="absolute inset-0 bg-grid opacity-100" />

      {/* ── Gradient orbs ── */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#7c3aed]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      {/* ── Scan line ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-[scan-y_6s_linear_infinite]" style={{ top: 0 }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-12 flex flex-col items-center gap-10">

        {/* ── Badge ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 text-xs font-semibold text-primary"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Plateforme premium de location — 500+ véhicules disponibles
        </motion.div>

        {/* ── Headline ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-3"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Conduisez le{' '}
            <span className="gradient-text">Futur</span>
            <br />
            <span className="text-white/90">dès Aujourd'hui</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Voitures premium, SUV de luxe et véhicules électriques — réservez en 30 secondes.
          </p>
        </motion.div>

        {/* ── Search form ── */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSearch}
          className="w-full max-w-4xl glass-dark rounded-2xl p-6 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row items-stretch gap-4">

            {/* Location */}
            <div className="flex-1">
              <label className="flex items-center gap-1.5 text-white/60 text-xs font-medium mb-2">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Lieu de prise en charge
              </label>
              <div className="relative">
                <select
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer appearance-none"
                >
                  <option value="" className="bg-[#0d0d2b] text-white">Sélectionner une ville</option>
                  {cityList.map((city) => (
                    <option key={city} value={city} className="bg-[#0d0d2b] text-white">{city}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date range */}
            <div className="flex-1 relative">
              <label className="flex items-center gap-1.5 text-white/60 text-xs font-medium mb-2">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Période de location
              </label>
              <div
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full px-4 py-3 text-sm rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer hover:border-primary/50 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <div className="text-white/40 text-xs">Départ</div>
                    <div className="font-medium">{startDate ? startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '—'}</div>
                  </div>
                  <div className="text-primary/60">→</div>
                  <div className="text-left">
                    <div className="text-white/40 text-xs">Retour</div>
                    <div className="font-medium">{endDate ? endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '—'}</div>
                  </div>
                </div>
                {calculateDays() > 0 && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold">
                    {calculateDays()}j
                  </span>
                )}
              </div>

              <AnimatePresence>
                {showCalendar && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 z-50 bg-[#0d0d2b] border border-[#00d4ff20] rounded-2xl shadow-2xl p-3"
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
                    />
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                      <span className="text-xs text-gray-400">
                        {calculateDays() > 0 ? `${calculateDays()} jour${calculateDays() > 1 ? 's' : ''}` : 'Sélectionnez les dates'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowCalendar(false)}
                        className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dull transition-colors"
                      >
                        Confirmer
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                className="relative w-full lg:w-auto px-8 py-3 text-sm font-bold text-white rounded-xl overflow-hidden group"
              >
                <span className="absolute inset-0 bg-linear-to-r from-primary to-[#7c3aed]" />
                <span className="absolute inset-0 bg-linear-to-r from-primary to-[#7c3aed] blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Rechercher
                </span>
              </motion.button>
            </div>
          </div>

          {/* Quick options */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {quickOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => {
                  const start = new Date()
                  start.setDate(start.getDate() + opt.days)
                  const end = new Date(start)
                  end.setDate(end.getDate() + 3)
                  handleDateChange([start, end])
                }}
                className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-white/60 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.form>

        {/* ── Floating car with 3D effect ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-full max-w-2xl"
        >
          <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-[#7c3aed]/10 blur-2xl rounded-full" />
          <img
            src={assets.main_car}
            alt="Voiture premium"
            className="relative z-10 w-full max-h-64 object-contain drop-shadow-2xl animate-float-3d"
            style={{ filter: 'drop-shadow(0 20px 40px rgba(0, 212, 255, 0.15))' }}
          />
          {/* Glow under car */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/20 blur-2xl rounded-full" />
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 md:gap-10"
        >
          {[
            { value: '500+', label: 'Véhicules' },
            { value: '4.9★', label: 'Note moyenne' },
            { value: '30', label: 'Villes' },
            { value: '10K+', label: 'Clients satisfaits' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl font-black text-white neon-text">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>

      </div>

      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#07071a] to-transparent pointer-events-none" />
    </section>
  )
}

function getDaysUntilWeekend() {
  const day = new Date().getDay()
  if (day === 0 || day === 6) return 0
  if (day === 5) return 1
  return 6 - day
}

export default Hero
