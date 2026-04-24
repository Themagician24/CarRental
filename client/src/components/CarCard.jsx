import { useRef, useState } from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

const CarCard = ({ car, index = 0 }) => {
  const currency = import.meta.env.VITE_CURRENCY || '€'
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const [tiltStyle, setTiltStyle] = useState({})
  const isEV = car.fuel_type?.toLowerCase() === 'electric'

  const onMouseMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) scale(1.02) translateZ(6px)`,
      transition: 'transform 0.1s ease-out',
    })
  }

  const onMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)',
      transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      <article
        ref={cardRef}
        style={tiltStyle}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={() => {
          navigate(`/car-details/${car._id}`)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        className={`relative cursor-pointer rounded-2xl overflow-hidden bg-white group
          shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.14)]
          border transition-all duration-300
          ${isEV
            ? 'border-emerald-100 hover:border-emerald-200'
            : 'border-gray-100 hover:border-gray-200'
          }`}
      >
        {/* ── Image ── */}
        <div className="relative h-52 overflow-hidden bg-gray-50">
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

          {/* EV badge */}
          {isEV && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-emerald-500/30">
              <span>⚡</span>
              <span>Électrique</span>
            </div>
          )}

          {/* Available badge */}
          {!isEV && car.isAvailable && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-gray-100">
              Disponible
            </div>
          )}

          {/* Price tag */}
          <div className="absolute bottom-3 right-3">
            <div className="bg-white rounded-xl px-3 py-1.5 shadow-lg shadow-black/10">
              <span className="font-black text-gray-900 text-[15px]">{currency}{car.pricePerDay}</span>
              <span className="text-gray-400 text-xs font-medium">/j</span>
            </div>
          </div>

          {/* EV range */}
          {isEV && car.range_km && (
            <div className="absolute bottom-3 left-3 bg-emerald-500/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              {car.range_km} km
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="p-5">
          <div className="mb-3">
            <h3 className={`text-[15px] font-bold text-gray-900 mb-0.5 transition-colors duration-200
              ${isEV ? 'group-hover:text-emerald-600' : 'group-hover:text-primary'}`}>
              {car.brand} {car.model}
            </h3>
            <p className="text-xs text-gray-400">{car.category} · {car.year}</p>
          </div>

          {/* EV range bar */}
          {isEV && car.range_km && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100/80">
              <div className="flex items-center justify-between text-[11px] text-emerald-700 mb-2">
                <span className="font-semibold">Autonomie</span>
                <span className="font-bold">{car.range_km} km</span>
              </div>
              <div className="h-1 rounded-full bg-emerald-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-emerald-400 to-teal-400 battery-charge"
                  style={{ '--battery-width': `${Math.min((car.range_km / 700) * 100, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-emerald-500">
                <span>⚡ {car.charge_time}</span>
                <span>{car.battery_kwh} kWh</span>
              </div>
            </div>
          )}

          {/* Specs */}
          <div className="grid grid-cols-2 gap-2">
            <Spec icon={assets.users_icon} label={`${car.seating_capacity} places`} />
            <Spec icon={assets.fuel_icon} label={car.fuel_type} />
            <Spec icon={assets.car_icon} label={car.transmission} />
            <Spec icon={assets.location_icon} label={car.location} />
          </div>
        </div>

        {/* Bottom highlight on hover */}
        <div className={`absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left
          ${isEV
            ? 'bg-linear-to-r from-emerald-400 to-teal-400'
            : 'bg-linear-to-r from-primary to-[#7c3aed]'
          }`}
        />
      </article>
    </motion.div>
  )
}

const Spec = ({ icon, label }) => (
  <div className="flex items-center gap-1.5 overflow-hidden">
    <img src={icon} alt="" className="h-3.5 w-3.5 opacity-40 shrink-0" />
    <span className="truncate text-[12px] text-gray-500">{label}</span>
  </div>
)

export default CarCard
