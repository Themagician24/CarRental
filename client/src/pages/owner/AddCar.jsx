import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'


const AddCar = () => {

  const {axios,currency} = useAppContext()

  

  const [image, setImage] = useState(null)
  const cityOptions = [
    "Paris","Marseille","Lyon","Toulouse","Nice","Nantes","Strasbourg","Montpellier","Bordeaux","Lille",
    "Rennes","Reims","Le Havre","Saint-Étienne","Toulon","Grenoble","Dijon","Angers","Nîmes","Villeurbanne",
    "Clermont-Ferrand","Le Mans","Aix-en-Provence","Brest","Tours","Amiens","Limoges","Annecy","Perpignan","Metz"
  ]
  const [car , setCar] = useState({
    brand:'',
    model: '',
    year: 0,
    category: '',
    seating_capacity: 0,
    fuel_type: '',
    transmission: '',
    pricePerDay: 0,
    location: '',
    description: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return null;
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('carData', JSON.stringify(car))
      const {data} = await axios.post('/api/owner/add-car', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (data.success) {
        toast.success('Car added successfully')
        setImage(null)
        setCar({
          brand:'',
          model: '',
          year: 0,
          category: '',
          seating_capacity: 0,
          fuel_type: '',
          transmission: '',
          pricePerDay: 0,
          location: '',
          description: ''
        })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className='px-4 py-10 flex-1'>

      <Title title="Add New Car" subTitle="Fill in details to list a new car for booking,
      including pricing ,availability and car specifications"  />

      <form
       onSubmit= {onSubmitHandler}
       className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl">

        {/* Car Image */}

        <div className="flex items-center gap-2 w-full">
          <label htmlFor="car-image"
          className="">
            <img src={image ? URL.createObjectURL(image) : assets.upload_icon}
            alt=""
            className="cursor-pointer h-14 rounded" />

            <input
            type="file"
            id="car-image"
            accept='image/*'
            hidden
            onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          <p className="text-xs text-gray-500">
            Upload a picture of your car
          </p>
        </div>

        {/* Car Brands and Models */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="flex flex-col w-full">

          <label htmlFor="" className="">Brand</label>
          <input
            type="text"
            placeholder='e.g. BMW, Mercedes,Tesla, Audi ...'
            required
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            value={car.brand}
            onChange={(e) => setCar({ ...car, brand: e.target.value })}
          />

          </div>

          <div className="flex flex-col w-full">

          <label htmlFor="" className="">Model</label>
          <input
            type="text"
            placeholder='e.g. X6, G-Wagon,E-Class, M4 ...'
            required
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            value={car.model}
            onChange={(e) => setCar({ ...car, model: e.target.value })}
          />
          </div>
        </div>

        {/* Car year and category */}

        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6">

          <div className="flex flex-col w-full">
            <label>Year</label>
            <input
              type="number"
              placeholder='e.g. 2026'
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.year}
              onChange={(e) => setCar({ ...car, year: e.target.value })}
            />
          </div>


           <div className="flex flex-col w-full">
            <label>Daily Price ({currency})</label>
            <input
              type="number"
              placeholder='100'
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.pricePerDay}
              onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
            />
          </div>



           <div className="flex flex-col w-full">
            <label>Category</label>
           <select
           onChange={e=> setCar({
            ...car, category: e.target.value
           })}
           className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none">

            <option value="">
              Select a category
            </option>

            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="SUV">SUV</option>
            <option value="Coupe">Coupe</option>
            <option value="Convertible">Convertible</option>
            <option value="Minivan">Minivan</option>
            <option value="Pickup">Pickup</option>
            <option value="Van">Van</option>


           </select>
          </div>


        </div>



       {/* Car transmission , fuel type , seating capacity */}

       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            <div className="flex flex-col w-full">
            <label>Transmission</label>
           <select
           onChange={e=> setCar({
            ...car, transmission: e.target.value
           })}
           value={car.transmission}
           className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none">

            <option value="">
              Select a transmission
            </option>

            <option value="Sedan">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="Semi-Automatic">Semi-Automatic</option>

           </select>
          </div>


            <div className="flex flex-col w-full">
            <label>Fuel type</label>
           <select
           onChange={e=> setCar({
            ...car, fuel_type: e.target.value
           })}
           value={car.fuel_type}
           className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none">

            <option value="">
              Select a fuel type
            </option>

            <option value="Gaz">Gas</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
            <option value="Plug-in Hybrid">Plug-in Hybrid</option>
           </select>
          </div>

           <div className="flex flex-col w-full">
            <label>Seating capacity</label>
            <input
              type="number"
              placeholder='4'
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.seating_capacity}
              onChange={(e) => setCar({ ...car, seating_capacity: e.target.value })}
            />
          </div>

       </div>


       {/* Car Location */}


       <div className="flex flex-col w-full">

         <label>Location</label>
          <select
          onChange={e=> setCar({
           ...car, location: e.target.value
          })}
          value={car.location}
          className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none">

           <option value="">
             Select a location
           </option>

           {cityOptions.map((city) => (
            <option key={city} value={city}>{city}</option>
           ))}

          </select>

      </div>


      {/* Car description */}



      <div className="flex flex-col w-full">
            <label>Description</label>
            <textarea
            rows={5}
              placeholder='e.g.  A luxurious SUV with a spacious interior and a powerful engine.'
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.description}
              onChange={(e) => setCar({ ...car, description: e.target.value })}
            ></textarea>
          </div>

          <button
          type=''
          className="flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium
          w-max cursor-pointer">
           <img src={assets.tick_icon} alt="" className='' />
           {isLoading ? 'Listing...' : 'List Your Car'}
            </button>



      </form>

    </div>
  )
}

export default AddCar
