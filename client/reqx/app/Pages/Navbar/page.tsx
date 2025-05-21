"use client"

import React from 'react'
import Link from 'next/link'

const Navbar = () => {

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-2 mt-3">
      <div className="
        mx-auto
        px-4 sm:px-6 lg:px-8
        w-full
      ">
        <div
          className="
            mx-auto max-w-7xl
            bg-[#0c1222]/80 backdrop-blur-md
            rounded-full border border-blue-900/30
            shadow-lg shadow-blue-900/10
            py-1.5 sm:py-2
            px-4 sm:px-6 md:px-8
          "
        >
          <div className="flex items-center justify-start">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="flex items-center">
                  <span className="
                    font-bold bg-gradient-to-r from-blue-400 to-purple-500
                    text-transparent bg-clip-text
                    text-xl sm:text-2xl
                  ">
                    ReqX
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
