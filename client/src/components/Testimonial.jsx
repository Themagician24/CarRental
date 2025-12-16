import React from 'react'
import Title from './Title.jsx'
import { assets } from '../assets/assets.js'

const Testimonial = () => {

  const testimonials = [
    {
        name: "Lariisa Mbohou",
        location: "Kribi, Cameroon",
        image: assets.testimonial_image_1,


        testimonial: "Service impeccable ! Les véhicules sont propres, bien entretenus et livrés à temps. L’équipe a été professionnelle du début à la fin. Je recommande fortement !"
    },

    {
        name: "Christine Dubée",
        location: "Paris, France",
        image: assets.testimonial_image_2,


        testimonial: "Une expérience fluide et sans stress. La réservation a été rapide, la voiture était comme neuve, et le service client vraiment au top. Merci pour cette qualité !"
    },

    {
        name: "Lathifa Diallo",
        location: "Dakar, Senegal",
        image: assets.testimonial_image_1,

        testimonial: "Excellente prestation ! Le véhicule était parfait, le prix raisonnable et l’équipe très réactive. J’ai apprécié le sérieux et la fiabilité du service."
    }
];
;





  return (


     <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">

        <Title title="What Our Customers Say"
        subTitle="Discover why discerning travelers choose
         StayVenture for their luxury accomodations around the world." align="center" />




        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:translate-y-1 transition-all duration-500">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className=" text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                                <img key={index} src={assets.star_icon} alt="" />

                            ))}
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4 font-light">"{testimonial.testimonial}"</p>
                    </div>
                ))}
            </div>
        </div>
  )
}

export default Testimonial
