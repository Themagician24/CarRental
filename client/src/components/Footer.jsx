import { motion } from 'motion/react'
import { assets } from '../assets/assets.js'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Nos véhicules', href: '/cars' },
  { label: 'Louer ma voiture', href: '/owner' },
  { label: 'Mes réservations', href: '/my-bookings' },
]

const SUPPORT_LINKS = [
  { label: "Centre d'aide", href: '#' },
  { label: "Conditions d'utilisation", href: '#' },
  { label: 'Confidentialité', href: '#' },
  { label: 'Assurance', href: '#' },
]

const SOCIALS = [
  { icon: assets.facebook_logo, label: 'Facebook' },
  { icon: assets.instagram_logo, label: 'Instagram' },
  { icon: assets.twitter_logo, label: 'Twitter' },
  { icon: assets.gmail_logo, label: 'Email' },
]

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#07071a] text-gray-400">
      {/* Top accent */}
      <div className="h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 pt-16 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-white/[0.06]"
        >
          {/* Brand */}
          <div className="md:col-span-1">
            <img src={assets.logo} alt="CarRental" className="h-9 brightness-0 invert mb-5" />
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Location de voitures premium avec une sélection de véhicules de luxe, hybrides et électriques dans toute la France.
            </p>
            <div className="flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 hover:border-primary/30 hover:scale-105 transition-all duration-200"
                >
                  <img src={s.icon} alt="" className="w-4 h-4 opacity-55 brightness-0 invert" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-5">Navigation</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map(link => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-5">Support</h3>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-5">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-500">237 Luxury Drive</li>
              <li className="text-gray-500">Yaoundé, Cameroun</li>
              <li>
                <a href="tel:+237123456789" className="text-primary hover:text-primary/80 transition-colors duration-200">
                  +237 123 456 789
                </a>
              </li>
              <li>
                <a href="mailto:info@carrental.com" className="text-primary hover:text-primary/80 transition-colors duration-200">
                  info@carrental.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2.5">Restez informé</p>
              <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-linear-to-r from-primary to-[#7c3aed] text-white text-xs font-semibold rounded-lg hover:shadow-[0_0_16px_rgba(0,212,255,0.35)] transition-shadow"
                >
                  →
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p className="text-xs text-gray-600">
            © {year} <span className="text-gray-500">CarRental</span>. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">Confidentialité</a>
            <span className="text-gray-700">·</span>
            <a href="#" className="hover:text-gray-400 transition-colors">Conditions</a>
            <span className="text-gray-700">·</span>
            <a href="#" className="hover:text-gray-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-11 h-11 rounded-xl bg-linear-to-r from-primary to-[#7c3aed] text-white shadow-[0_0_20px_rgba(0,212,255,0.3)] flex items-center justify-center z-40 text-sm font-bold"
        aria-label="Retour en haut"
      >
        ↑
      </motion.button>
    </footer>
  )
}

export default Footer
