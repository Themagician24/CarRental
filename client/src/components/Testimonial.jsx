import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Title from "./Title.jsx";
import { assets } from "../assets/assets.js";

/**
 * Données des témoignages enrichies
 */
const TESTIMONIALS = [
  {
    id: 1,
    name: "Lariisa Mbohou",
    location: "Kribi, Cameroon",
    image: assets.testimonial_image_1,
    message: "Service impeccable ! Les véhicules sont propres, bien entretenus et livrés à temps. L'équipe a été professionnelle du début à la fin. Je recommande fortement !",
    rating: 5,
    verified: true,
    date: "Il y a 2 jours"
  },
  {
    id: 2,
    name: "Christine Dubée",
    location: "Paris, France",
    image: assets.testimonial_image_2,
    message: "Une expérience fluide et sans stress. La réservation a été rapide, la voiture était comme neuve, et le service client vraiment au top. Merci pour cette qualité !",
    rating: 5,
    verified: true,
    date: "Il y a 1 semaine"
  },
  {
    id: 3,
    name: "Lathifa Diallo",
    location: "Dakar, Senegal",
    image: assets.testimonial_image_1,
    message: "Excellente prestation ! Le véhicule était parfait, le prix raisonnable et l'équipe très réactive. J'ai apprécié le sérieux et la fiabilité du service.",
    rating: 4,
    verified: true,
    date: "Il y a 2 semaines"
  },
  {
    id: 4,
    name: "Marcus Johnson",
    location: "New York, USA",
    image: assets.testimonial_image_2,
    message: "The best car rental experience I've had! The luxury cars are maintained to perfection. The team went above and beyond to accommodate my last-minute changes.",
    rating: 5,
    verified: false,
    date: "Il y a 1 mois"
  },
  {
    id: 5,
    name: "Sophie Chen",
    location: "Tokyo, Japan",
    image: assets.testimonial_image_1,
    message: "Absolutely perfect service from start to finish. The car was delivered spotless and the process was seamless. Will definitely use again for business trips.",
    rating: 5,
    verified: true,
    date: "Il y a 3 jours"
  },
  {
    id: 6,
    name: "Ahmed Hassan",
    location: "Dubai, UAE",
    image: assets.testimonial_image_2,
    message: "Exceptional luxury car rental service. The attention to detail is unmatched. From booking to drop-off, everything was handled with utmost professionalism.",
    rating: 5,
    verified: true,
    date: "Il y a 2 mois"
  }
];

/**
 * Carte témoignage premium
 */
const TestimonialCard = ({ name, location, image, message, rating, verified, date, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: isActive ? 1 : 1.05,
        boxShadow: isActive ? "0 25px 50px -12px rgba(0, 0, 0, 0.15)" : "0 10px 25px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ duration: 0.3 }}
      className={`
        relative group bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl
        border border-gray-100 cursor-pointer transition-all duration-300
        ${isActive ? 'scale-105 ring-2 ring-indigo-500 ring-opacity-20' : ''}
      `}
    >
      {/* Badge vérifié */}
      {verified && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-500 to-green-400 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Vérifié
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex flex-col h-full">
        {/* Header avec avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={image}
              alt={name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{name}</h3>
              <span className="text-xs text-gray-400">{date}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-500">{location}</p>
            </div>
          </div>
        </div>

        {/* Évaluation avec étoiles */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-700">{rating}.0</span>
        </div>

        {/* Message témoignage */}
        <div className="relative flex-1">
          <div className="absolute top-0 left-0 text-5xl text-indigo-100 font-serif leading-none">"</div>
          <p className="text-gray-600 leading-relaxed pl-4 pt-2 mb-6">
            {message}
          </p>
          <div className="absolute bottom-0 right-0 text-5xl text-indigo-100 font-serif leading-none rotate-180">"</div>
        </div>

        {/* Footer avec actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Utile
          </button>
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Répondre
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Composant principal premium
 */
const Testimonial = () => {
  const [activeCard, setActiveCard] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef(null);

  const cardsPerPage = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const totalPages = Math.ceil(TESTIMONIALS.length / cardsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <section className="relative py-32 px-4 md:px-8 lg:px-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-indigo-50/30 -z-10" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-30 -z-10" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-30 -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header avec animations */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 font-semibold rounded-full text-sm mb-4">
            TÉMOIGNAGES CLIENTS
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Ils parlent <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">de nous</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez pourquoi nos clients nous font confiance pour des expériences de location de voiture premium et sans tracas
          </p>
        </motion.div>

        {/* Contrôles de navigation */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="p-3 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="p-3 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === currentPage ? 'bg-indigo-600 w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        </div>

        {/* Grille des témoignages */}
        <div ref={scrollRef} className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {TESTIMONIALS
                .slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage)
                .map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    {...testimonial}
                    isActive={activeCard === testimonial.id}
                    onClick={() => setActiveCard(testimonial.id)}
                  />
                ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Statistiques impressionnantes */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "4.9/5", label: "Note moyenne", icon: "⭐" },
            { value: "10K+", label: "Clients satisfaits", icon: "😊" },
            { value: "98%", label: "Taux de satisfaction", icon: "📈" },
            { value: "24/7", label: "Support disponible", icon: "🛡️" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-gray-600 mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonial;
