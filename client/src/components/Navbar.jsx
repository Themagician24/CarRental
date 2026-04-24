import { useState, useEffect } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'motion/react'

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner, setUser, fetchUser } = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  const changeRole = async () => {
    try {
      const { data } = await axios.post('/api/owner/change-role')
      if (data.success) {
        setIsOwner(true)
        setUser(prev => prev ? { ...prev, role: 'owner' } : prev)
        fetchUser()
        toast.success('Rôle changé en propriétaire')
        navigate('/owner')
      } else {
        toast.error('Échec du changement de rôle')
      }
    } catch {
      toast.error('Échec du changement de rôle')
    }
  }

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07071a] shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl'
          : 'bg-[#07071a]/92 backdrop-blur-xl'
      }`}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 h-[72px]">

        {/* Logo */}
        <Link to="/" className="shrink-0">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            src={assets.logo}
            alt="CarRental"
            className="h-8 brightness-0 invert"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1">
          {menuLinks.map((link) => {
            const active = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${active
                    ? 'text-white bg-white/8'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {link.name}
                {active && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right actions */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => isOwner ? navigate('/owner') : changeRole()}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
          >
            {isOwner ? 'Dashboard' : 'Louer ma voiture'}
          </button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => user ? logout() : setShowLogin(true)}
            className="ml-1 px-5 py-2 text-sm font-semibold text-white rounded-xl bg-linear-to-r from-primary to-[#7c3aed] shadow-[0_0_20px_rgba(0,212,255,0.15)] hover:shadow-[0_0_30px_rgba(0,212,255,0.35)] transition-shadow duration-300"
          >
            {user ? 'Déconnexion' : 'Connexion'}
          </motion.button>
        </div>

        {/* Mobile burger */}
        <button
          className="sm:hidden p-2 text-gray-300 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <div className="w-5 space-y-1.5">
            <span className={`block h-px bg-current transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-2.5' : ''}`} />
            <span className={`block h-px bg-current transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-px bg-current transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-2.5' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="sm:hidden overflow-hidden bg-[#07071a] border-t border-white/[0.06]"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {menuLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={link.path}
                    className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'text-white bg-white/8'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <div className="flex gap-3 pt-3 mt-2 border-t border-white/[0.06]">
                <button
                  onClick={() => isOwner ? navigate('/owner') : changeRole()}
                  className="flex-1 py-2.5 text-sm border border-white/10 text-gray-300 rounded-xl hover:bg-white/5 transition-all"
                >
                  {isOwner ? 'Dashboard' : 'Louer ma voiture'}
                </button>
                <button
                  onClick={() => user ? logout() : setShowLogin(true)}
                  className="flex-1 py-2.5 text-sm font-semibold bg-linear-to-r from-primary to-[#7c3aed] text-white rounded-xl"
                >
                  {user ? 'Déconnexion' : 'Connexion'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navbar
