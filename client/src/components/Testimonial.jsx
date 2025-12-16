import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets.js";

/**
 * Testimonials data in English
 */
const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    image: assets.testimonial_image_1,
    message: "Exceptional service! The cars are always clean, well-maintained, and delivered on time. The team's professionalism from start to finish was impressive. Highly recommended!",
    rating: 5,
    verified: true,
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "San Francisco, USA",
    image: assets.testimonial_image_2,
    message: "A seamless and stress-free experience. Booking was quick, the car was like new, and customer service was top-notch. Thank you for the quality service!",
    rating: 5,
    verified: true,
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Emma Williams",
    location: "London, UK",
    image: assets.testimonial_image_1,
    message: "Outstanding service! The vehicle was perfect, pricing was reasonable, and the team was very responsive. I appreciated the reliability and professionalism.",
    rating: 5,
    verified: true,
    date: "2 weeks ago"
  },
  {
    id: 4,
    name: "David Rodriguez",
    location: "Miami, USA",
    image: assets.testimonial_image_2,
    message: "The best luxury car rental experience I've ever had! Perfectly maintained vehicles and the team went above and beyond to accommodate my schedule changes.",
    rating: 5,
    verified: true,
    date: "1 month ago"
  },
  {
    id: 5,
    name: "Sophie Kim",
    location: "Seoul, South Korea",
    image: assets.testimonial_image_1,
    message: "Absolutely perfect from start to finish. The car was spotless and the entire process was seamless. Will definitely use again for business trips.",
    rating: 5,
    verified: true,
    date: "3 days ago"
  },
  {
    id: 6,
    name: "Ahmed Hassan",
    location: "Dubai, UAE",
    image: assets.testimonial_image_2,
    message: "Unmatched attention to detail. From booking to drop-off, everything was handled with utmost professionalism. Truly exceptional service.",
    rating: 5,
    verified: true,
    date: "2 months ago"
  }
];

/**
 * Premium Testimonial Card Component
 */
const TestimonialCard = ({ name, location, image, message, rating, verified, date, isActive, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`
        relative group bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl
        border border-gray-100 cursor-pointer transition-all duration-300
        ${isActive ? 'scale-105 ring-4 ring-blue-500 ring-opacity-10 shadow-2xl' : 'shadow-lg hover:shadow-xl'}
        backdrop-blur-sm
      `}
    >
      {/* Verified Badge */}
      {verified && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg z-10"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Verified
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex flex-col h-full">
        {/* Header with avatar and info */}
        <div className="flex items-start gap-5 mb-6">
          <div className="relative shrink-0">
            <div className="relative">
              <img
                src={image}
                alt={name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-bold text-gray-900 truncate">{name}</h3>
              <span className="text-xs text-gray-400 font-medium shrink-0">{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-500 truncate">{location}</p>
            </div>
          </div>
        </div>

        {/* Rating stars */}
        <div className="flex items-center gap-3 mb-5">
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
          <span className="text-sm font-bold text-gray-700">{rating}.0</span>
          <div className="h-4 w-px bg-gray-200"></div>
          <span className="text-sm font-medium text-gray-500">Excellent</span>
        </div>

        {/* Testimonial message */}
        <div className="relative flex-1 mb-6">
          <div className="absolute -top-3 -left-2 text-5xl text-blue-100 font-serif leading-none">"</div>
          <p className="text-gray-600 leading-relaxed pl-3 pt-1 line-clamp-4">
            {message}
          </p>
          <div className="absolute -bottom-3 -right-2 text-5xl text-blue-100 font-serif leading-none rotate-180">"</div>
        </div>

        {/* Footer with actions */}
        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors group">
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Helpful
          </button>
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors group">
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Reply
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Main Component
 */
const Testimonials = () => {
  const [activeCard, setActiveCard] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);
  const scrollRef = useRef(null);

  useEffect(() => {
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width < 640) setCardsPerPage(1);
      else if (width < 1024) setCardsPerPage(2);
      else setCardsPerPage(3);
    };

    updateCardsPerPage();
    window.addEventListener('resize', updateCardsPerPage);
    return () => window.removeEventListener('resize', updateCardsPerPage);
  }, []);

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
    <section className="relative py-20 md:py-32 px-4 md:px-8 lg:px-16 overflow-hidden">
      {/* Enhanced Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50 -z-20" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-50/20 to-transparent -z-10" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-40 -z-10" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full blur-3xl opacity-40 -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block px-5 py-2.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-semibold rounded-full text-sm mb-6 border border-blue-200 shadow-sm"
          >
            CUSTOMER TESTIMONIALS
          </motion.span>

          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            What Our <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Clients Say</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Discover why thousands of customers trust us for premium, hassle-free luxury car rental experiences
          </motion.p>
        </motion.div>

        {/* Enhanced Navigation Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="p-3.5 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all group hover:border-blue-300 hover:scale-105"
            >
              <svg className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="p-3.5 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all group hover:border-blue-300 hover:scale-105"
            >
              <svg className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === currentPage ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400 w-3'}`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 font-medium">
              Page {currentPage + 1} of {totalPages}
            </span>
          </div>
        </motion.div>

        {/* Enhanced Testimonials Grid */}
        <div ref={scrollRef} className="relative mb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
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

        {/* Enhanced Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Our Excellence in Numbers</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Trusted by thousands of satisfied customers worldwide</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                value: "4.9/5",
                label: "Average Rating",
                icon: "⭐",
                color: "from-yellow-400 to-orange-400"
              },
              {
                value: "10K+",
                label: "Happy Clients",
                icon: "😊",
                color: "from-green-400 to-emerald-600"
              },
              {
                value: "98%",
                label: "Satisfaction Rate",
                icon: "📈",
                color: "from-blue-400 to-cyan-500"
              },
              {
                value: "24/7",
                label: "Support Available",
                icon: "🛡️",
                color: "from-indigo-400 to-purple-500"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm md:text-base font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-100">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to experience premium service?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their travel experience with our luxury car rentals.
            </p>
            <button className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg">
              Book Your Luxury Car Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
