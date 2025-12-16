import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAppContext } from '../context/AppContext';
import {motion} from 'motion/react'

const Navbar = () => {

  const {setShowLogin, user, logout, isOwner,axios, setIsOwner, setUser, fetchUser} = useAppContext();

  // Récupère l'URL actuelle pour styliser la navbar
  const location = useLocation()

  // Pour ouvrir / fermer le menu sur mobile
  const [open, setOpen] = useState(false)

  // Navigation programmée
  const navigate = useNavigate()

  const changeRole = async () => {
    try {
    const {data} =  await axios.post('/api/owner/change-role');
    if (data.success) {
      setIsOwner(true);
      setUser((prev) => prev ? ({ ...prev, role: 'owner' }) : prev);
      fetchUser(); // recharge pour aligner avec la BDD
      toast.success("Role changed to owner");
      navigate('/owner');
    }else {
      toast.error("Failed to change role");
    }
    } catch (error) {
      toast.error("Failed to change role");
    }
  }

  return (
    <motion.div
    initial={{y: -20, opacity: 0}}
    animate={{y: 0, opacity: 1}}
    transition={{duration: 0.5}}

     className={`flex items-center justify-between
      px-6 md:px-16 lg:px-24 xl:px-32
      py-4 text-gray-600 border-b border-borderColor relative transition-all
      ${location.pathname === "/" && "bg-light"}`}>

      {/* Logo = lien vers home */}
      <Link to="/">
        <motion.img
        whileHover={{ scale: 1.05 }}
         src={assets.logo} alt="logo" className='h-8' />
      </Link>

      {/* Menu principal */}
      <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t
        border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4
        sm:gap-8 max-sm:p-4 transition-all duration-300 z-50
        ${location.pathname === "/" ? "bg-light" : "bg-white"}
        ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>

        {/* Liens du menu */}
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path}>
            {link.name}
          </Link>
        ))}

        {/* Barre de recherche (desktop uniquement) */}
        <div className='hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full w-56'>
          <input
            type='text'
            className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500'
            placeholder='Search Products'
          />
          <img src={assets.search_icon} alt='search' />
        </div>

        {/* Actions utilisateur */}
        <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>

          {/* 🔥 BOUTON DASHBOARD QUI MARCHE */}
          <button
            onClick={() => isOwner ? navigate('/owner'): changeRole()}
            className='cursor-pointer font-medium hover:text-primary transition-colors'
          >
            {isOwner ? 'Owner Dashboard' :  'List cars'}
          </button>

          {/* Bouton login */}
          <button
            onClick={() => {user ? logout() : setShowLogin(true)}}
            className='cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull
            transition-all text-white rounded-lg'
          >
            {user ? 'Logout' : 'Login'}
          </button>

        </div>

      </div>

      {/* Bouton menu mobile */}
      <button
        className='sm:hidden cursor-pointer'
        aria-label='Menu'
        onClick={() => setOpen(!open)}
      >
        <img src={open ? assets.close_icon : assets.menu_icon} alt='menu' />
      </button>

    </motion.div>
  )
}

export default Navbar
