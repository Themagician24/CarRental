import React from 'react'
import { motion } from 'framer-motion'

const Title = ({ title, subTitle, align = 'left' }) => {
  const alignClass =
    align === 'left'
      ? 'items-start text-left'
      : align === 'right'
      ? 'items-end text-right'
      : 'items-center text-center'

  return (
    <section className="relative mb-16">
      {/* Subtle background grid */}
      <div className="absolute inset-0 -z-10 opacity-[0.035] bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] [background-size:24px_24px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`flex flex-col gap-6 ${alignClass}`}
      >
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide
          bg-gradient-to-r from-primary/10 to-primary-dull/10 text-primary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Dashboard
        </motion.span>

        {/* Title */}
        <h1 className="text-[2.6rem] md:text-[3.2rem] font-extrabold tracking-tight leading-[1.05] text-gray-900">
          {title}
        </h1>

        {/* Gradient underline */}
        <div className="h-[3px] w-20 rounded-full bg-gradient-to-r from-primary to-primary-dull" />

        {/* Subtitle */}
        <p className="max-w-2xl text-base md:text-lg text-gray-500 leading-relaxed">
          {subTitle}
        </p>
      </motion.div>
    </section>
  )
}

export default Title
