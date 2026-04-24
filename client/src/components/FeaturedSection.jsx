import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import CarCard from './CarCard.jsx'

const STATS = [
  { value: '500+', label: 'Véhicules' },
  { value: '4.9★', label: 'Note moyenne' },
  { value: '30', label: 'Villes' },
  { value: '10K+', label: 'Clients' },
]

const FeaturedSection = () => {
  const navigate = useNavigate()
  const { cars } = useAppContext()
  const featured = cars.filter(c => c.fuel_type?.toLowerCase() !== 'electric').slice(0, 6)

  return (
    <section className="py-24 px-6 md:px-16 lg:px-24 xl:px-32 bg-white">

      {/* ── Cinematic video banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative h-[500px] rounded-3xl overflow-hidden mb-24 shadow-[0_32px_80px_rgba(0,0,0,0.18)]"
      >
        {/* YouTube embed — Mercedes EQS 2024 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <iframe
            src="https://www.youtube.com/embed/xwVWB-ZgMC8?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&playlist=xwVWB-ZgMC8&modestbranding=1&playsinline=1"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: 'max(177.78vh, 100%)', height: 'max(56.25vw, 100%)' }}
            frameBorder="0"
            allow="autoplay; encrypted-media; accelerometer; gyroscope"
            title="Mercedes EQS 2024"
          />
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-r from-[#07071a]/90 via-[#07071a]/55 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-[#07071a]/75 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-20" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-8 md:px-14">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-semibold mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              FLOTTE PREMIUM
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
              Des véhicules à la<br />
              <span className="gradient-text">hauteur de vos ambitions</span>
            </h2>

            <p className="text-white/55 leading-relaxed mb-8 text-[15px]">
              Chaque véhicule est soigneusement entretenu pour vous offrir confort, style et performance sans compromis.
            </p>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { navigate('/cars'); window.scrollTo(0, 0) }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-linear-to-r from-primary to-[#7c3aed] shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:shadow-[0_0_50px_rgba(0,212,255,0.5)] transition-shadow duration-300"
            >
              Explorer la flotte
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </motion.div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.08] bg-[#07071a]/80 backdrop-blur-sm px-8 md:px-14 py-4">
          <div className="flex items-center gap-8 md:gap-14">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="text-center"
              >
                <div className="text-lg font-black text-white leading-none">{s.value}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          VÉHICULES PREMIUM
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
          Notre Sélection{' '}
          <span className="relative inline-block">
            d'Exception
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-linear-to-r from-primary to-[#7c3aed] rounded-full" />
          </span>
        </h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Des véhicules soigneusement choisis pour vous offrir confort, style et performance.
        </p>
      </motion.div>

      {/* ── Cars grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.map((car, i) => (
          <CarCard key={car._id} car={car} index={i} />
        ))}
      </div>

      {/* ── CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mt-14"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { navigate('/cars'); window.scrollTo(0, 0) }}
          className="group flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:border-primary/40 hover:text-primary hover:bg-primary/3 transition-all duration-300"
        >
          Explorer tous les véhicules
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.button>
      </motion.div>
    </section>
  )
}

export default FeaturedSection
