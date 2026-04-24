import { motion, useScroll, useTransform } from 'motion/react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import CarCard from './CarCard'

const ElectricSection = () => {
  const { cars } = useAppContext()
  const navigate = useNavigate()

  const { scrollYProgress } = useScroll()
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  const evCars = cars.filter(c => c.fuel_type?.toLowerCase() === 'electric').slice(0, 3)

  if (evCars.length === 0) return null

  const stats = [
    { icon: '⚡', value: '600 km', label: 'Autonomie max' },
    { icon: '🔋', value: '20 min', label: 'Recharge rapide' },
    { icon: '🌍', value: '0 g', label: 'CO₂ émis' },
    { icon: '🚀', value: '2.1 s', label: '0–100 km/h' },
  ]

  return (
    <section className="relative overflow-hidden bg-[#07071a] py-24 px-6 md:px-16 lg:px-24 xl:px-32">

      {/* Parallax background grid */}
      <motion.div className="absolute inset-0 bg-grid opacity-100" style={{ y: bgY }} />

      {/* Green glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              RÉVOLUTION ÉLECTRIQUE
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Conduisez{' '}
              <span className="gradient-text-green">Électrique</span>
              <br />
              <span className="text-white/60 text-2xl md:text-3xl font-semibold">Zéro émission. 100% sensation.</span>
            </h2>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/cars')}
            className="flex-shrink-0 px-6 py-3 rounded-xl border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 transition-all text-sm font-semibold"
          >
            Voir tous les véhicules électriques →
          </motion.button>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass-dark rounded-2xl p-5 text-center border border-emerald-500/10 hover:border-emerald-500/25 transition-all"
            >
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-xl font-black text-white">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* EV Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {evCars.map((car, i) => (
            <CarCard key={car._id} car={car} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 relative overflow-hidden rounded-3xl p-px"
        >
          <div className="absolute inset-0 bg-linear-to-r from-emerald-500/40 via-teal-500/40 to-emerald-500/40 animate-gradient rounded-3xl" />
          <div className="relative bg-[#0a1a12] rounded-[calc(1.5rem-1px)] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                L'avenir est électrique 🌿
              </h3>
              <p className="text-gray-400 max-w-lg">
                Tous nos véhicules électriques sont rechargeables, assurés et livrés avec un câble de recharge. Contribuez à un monde plus propre tout en profitant de performances exceptionnelles.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/cars')}
              className="flex-shrink-0 relative px-8 py-3.5 rounded-xl font-bold text-white overflow-hidden group"
            >
              <span className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500" />
              <span className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
              <span className="relative z-10">Réserver maintenant</span>
            </motion.button>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default ElectricSection
