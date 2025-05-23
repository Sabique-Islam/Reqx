"use client"

import React from "react";
import Globe from './Globe';
import StarryBackground from '../../components/StarryBackground';

export default function Hero() {

  return (
    <div className="min-h-screen pt-16 bg-[#0c1222] text-white overflow-hidden relative flex items-center">
      <StarryBackground />
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-12 py-16 md:py-20 flex flex-col md:flex-row items-center">
        <div
          className="md:w-1/2 mb-16 md:mb-0 z-20 pl-0 sm:pl-2 pt-0"
        >
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-300 via-gray-500 to-blue-800 bg-clip-text text-transparent leading-tight mt-0"
          >
            Connect<br className="md:hidden" /> To The World
          </h1>
          <p
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-lg"
          >
            Keep track of friends around the globe no matter the distance.
          </p>
        </div>

        <div
          className="md:w-1/2 flex justify-center md:justify-end relative z-10"
        >
          <div className="relative w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] rounded-full overflow-hidden mx-auto">
            <Globe />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1222]/50 via-[#0c1222]/70 to-[#0c1222]/90 z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-blue-900/10 z-0" />
    </div>
  );
}
