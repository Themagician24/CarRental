import React, { useState } from 'react'
import {  assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const Sidebar = () => {

  const {user,axios,fetchUser} = useAppContext()
  const location = useLocation()

  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)

  const updateImage = async () => {
   if (!image) {
    toast.error('Choisissez une image')
    return
   }
  try {
     setUploading(true)
    const formData = new FormData()
    formData.append('image', image)
     const {data} = await axios.post('/api/owner/update-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
     })
    if (data.success) {
      fetchUser()
      toast.success('Image updated successfully')
      setImage('')
    } else {
        toast.error(data.message || 'Failed to update image')
    }
  } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update image')
    } finally {
      setUploading(false)
  }
  } 

  return (
    <div className="relative min-h-screen md:flex flex-col items-center pt-8
      max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm">

      {/* Avatar */}
      <div className="group relative cursor-pointer">
        <label htmlFor="image">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : user?.image ||
                  'https://static.wikia.nocookie.net/heroes-fr/images/9/99/Black_Panther_Portrait_Art.png/revision/latest?cb=20200701123842&path-prefix=fr'
            }
            alt="profile"
            className="w-20 h-20 rounded-full object-cover mx-auto shadow"
          />

          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/20 rounded-full hidden
            group-hover:flex items-center justify-center transition">
            <img src={assets.edit_icon} alt="edit" className="w-5" />
          </div>
        </label>
      </div>

      {/* Save Button */}
      {image && (
        <button
          onClick={updateImage}
          disabled={uploading}
          className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5
            bg-primary/15 text-primary rounded-md shadow hover:bg-primary/20"
        >
          {uploading ? 'Patiente...' : 'Save'}
          <img src={assets.check_icon} width={13} alt="" />
        </button>
      )}

      <p className="mt-3 text-base font-medium max-md:hidden">
        {user?.name || 'Owner'}
      </p>

      {/* Menu */}
      <div className="w-full mt-6">
        {ownerMenuLinks.map((link, index) => {
          const isActive = link.path === location.pathname
          return (
            <NavLink
              key={index}
              to={link.path}
              className={`relative flex items-center gap-3 w-full py-3 pl-5
                transition-all rounded-r-xl
                ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-500'}`}
            >
              <img
                src={isActive ? link.coloredIcon : link.icon}
                alt="menu icon"
                className="w-5"
              />

              <span className="max-md:hidden">{link.name}</span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-0 bg-primary w-1.5 h-8 rounded-l-full" />
              )}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar
