"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])

  const navItems = [
    { name: 'Features', href: '/features' },
    { name: 'About', href: '/about' },
  ]

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-2 mt-3"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`
        mx-auto
        px-4 sm:px-6 lg:px-8
        transition-all duration-300
        ${scrolled ? 'w-[95%] sm:w-[90%] md:w-[85%]' : 'w-full'}
      `}>
        <div
          className={`
            mx-auto max-w-7xl
            bg-[#0c1222]/80 backdrop-blur-md
            rounded-full border border-blue-900/30
            shadow-lg shadow-blue-900/10
            py-1.5 sm:py-2
            transition-all duration-300
            ${scrolled
              ? 'px-3 sm:px-5 md:px-6'
              : 'px-4 sm:px-6 md:px-8'
            }
          `}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="
                    font-bold bg-gradient-to-r from-blue-400 to-purple-500
                    text-transparent bg-clip-text transition-all duration-300
                    text-xl sm:text-2xl
                  ">
                    ReqX
                  </span>
                </motion.div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className={`
              hidden md:flex md:items-center
              transition-all duration-300
              ${scrolled ? 'md:space-x-4 lg:space-x-5' : 'md:space-x-6 lg:space-x-7'}
            `}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <motion.span
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    className="
                      inline-block
                      text-base
                      transition-all duration-300
                    "
                  >
                    {item.name}
                  </motion.span>
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <motion.button
                type="button"
                className="
                  text-gray-300 hover:text-white
                  transition-all duration-300
                  scale-100
                "
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`
              mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2
              transition-all duration-300
              ${scrolled ? 'w-[95%] sm:w-[90%] md:w-[85%]' : 'w-full'}
            `}>
              <div className="bg-[#0c1222]/90 backdrop-blur-md rounded-2xl border border-blue-900/30 py-2 px-4">
                <div className="space-y-1 pb-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-blue-900/20 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
