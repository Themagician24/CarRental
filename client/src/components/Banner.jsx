import { motion } from 'motion/react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const navigate = useNavigate()

  return (
    <section className="py-16 px-6 md:px-16 lg:px-24 xl:px-32 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl p-px max-w-6xl mx-auto"
      >
        {/* Animated neon border */}
        <div className="absolute inset-0 bg-linear-to-r from-[#0558FE] via-primary to-[#7c3aed] opacity-80 animate-gradient rounded-3xl" />

        {/* Inner */}
        <div className="relative bg-linear-to-br from-[#0a1628] to-[#0d0d2b] rounded-[calc(1.5rem-1px)] overflow-hidden">

          {/* Background grid */}
          <div className="absolute inset-0 bg-grid opacity-60" />

          {/* Glow orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#7c3aed]/15 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-8 md:px-14 py-12">

            {/* Text */}
            <div className="text-white max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-primary mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                POUR LES PROPRIÉTAIRES
              </div>

              <h2 className="text-3xl md:text-4xl font-black leading-tight mb-3">
                Vous avez une
                <br />
                <span className="gradient-text">voiture de luxe ?</span>
              </h2>

              <p className="text-white/60 leading-relaxed mb-2">
                Monétisez votre véhicule sans effort en le listant sur CarRental.
              </p>
              <p className="text-white/50 text-sm">
                Nous gérons l'assurance, la vérification des conducteurs et les paiements sécurisés — vous encaissez.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/owner')}
                className="mt-6 relative px-7 py-3 rounded-xl font-bold text-sm overflow-hidden group"
              >
                <span className="absolute inset-0 bg-white" />
                <span className="absolute inset-0 bg-white blur-md opacity-30 group-hover:opacity-60 transition-opacity" />
                <span className="relative z-10 text-[#0558FE] group-hover:text-[#0558FE]">
                  Lister ma voiture
                </span>
              </motion.button>
            </div>

            {/* Car image with 3D float */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative shrink-0"
            >
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
              <img
                src={assets.banner_car_image}
                alt="Voiture de luxe"
                className="relative z-10 max-h-52 w-auto drop-shadow-2xl animate-float"
                style={{ filter: 'drop-shadow(0 10px 30px rgba(0, 212, 255, 0.2))' }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default Banner
