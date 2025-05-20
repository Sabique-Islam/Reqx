"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import StarryBackground from '../../components/StarryBackground';

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <motion.div
      className="bg-[#0f1a33]/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-blue-900/30 h-full"
      whileHover={{
        y: -8,
        boxShadow:
          '0 25px 30px -5px rgba(0, 0, 0, 0.2), 0 15px 15px -5px rgba(0, 0, 0, 0.1)',
        borderColor: 'rgba(59, 130, 246, 0.5)',
      }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="text-blue-400 mb-5 text-3xl">{icon}</div>
      <h3 className="text-2xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-gray-300 text-lg">{description}</p>
    </motion.div>
  );
};

export default function Features() {
  const bannerSectionRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: bannerScrollProgress } = useScroll({
    target: bannerSectionRef,
    offset: ['start end', 'end start'],
  });

  const bannerY = useTransform(bannerScrollProgress, [0, 1], [0, 150]);
  const opacity = useTransform(bannerScrollProgress, [0, 0.5, 1], [1, 0.8, 0.6]);
  const scale = useTransform(bannerScrollProgress, [0, 1], [1, 1.1]);

  const featuresSectionRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <section
        ref={bannerSectionRef}
        className="min-h-screen bg-[#0c1222] text-white relative overflow-hidden flex flex-col justify-center items-center py-24"
      >
        <div className="absolute inset-0 z-0">
          <StarryBackground />
        </div>

        <div
          ref={bannerRef}
          className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden rounded-2xl mx-auto max-w-7xl px-4"
          style={{
            transform: `translateY(${bannerY.get()}px)`,
            opacity: opacity.get(),
            scale: scale.get(),
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c1222]/50 via-transparent to-[#0c1222]/50 z-10" />

          <div className="absolute inset-0 z-0 transition-transform duration-500 ease-out hover:scale-105">
            <Image
              src="/banner.png"
              alt="Friends App Banner"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
              className="rounded-2xl"
              priority
            />
          </div>
        </div>
      </section>

      <section
        ref={featuresSectionRef}
        className="min-h-screen bg-[#0c1222] text-white relative overflow-hidden py-28"
      >
        <div className="absolute inset-0 z-0">
          <StarryBackground />
        </div>

        <div className="text-center mb-20 px-4">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-gray-300 to-blue-500 bg-clip-text text-transparent">
            CRUD Functionality
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-xl md:text-2xl">
            Core operations supported by the Friends API backend
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 md:row-span-2">
              <FeatureCard
                title="Create Records"
                description="Add new entries by submitting name, email, age, and description."
                icon={<span>➕</span>}
              />
            </div>

            <div>
              <FeatureCard
                title="Read & Search"
                description="Fetch all records or a specific one using email as a query parameter."
                icon={<span>🔍</span>}
              />
            </div>

            <div>
              <FeatureCard
                title="Update Information"
                description="Modify any field in an existing record using a PUT request."
                icon={<span>✏️</span>}
              />
            </div>

            <div className="md:col-span-2">
              <FeatureCard
                title="Delete Records"
                description="Remove entries by targeting the email identifier in a DELETE request."
                icon={<span>🗑️</span>}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-3">
              <FeatureCard
                title="Data Visualization"
                description="Connect your frontend to render friend data visually using maps or charts."
                icon={<span>📊</span>}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}