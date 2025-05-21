"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import StarryBackground from '../../components/StarryBackground';
import { PlusCircle, Search, Edit, Trash2, BarChart3 } from 'lucide-react';

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
    <div
      className="bg-[#0f1a33]/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-blue-900/30 h-full"
    >
      <div className="text-blue-400 mb-5 flex items-center justify-center md:justify-start">{icon}</div>
      <h3 className="text-2xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-gray-300 text-lg">{description}</p>
    </div>
  );
};

export default function Features() {
  const bannerSectionRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const featuresSectionRef = useRef<HTMLDivElement>(null);

  // Removed scroll effects and animations

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
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c1222]/50 via-transparent to-[#0c1222]/50 z-10" />

          <div className="absolute inset-0 z-0">
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
                icon={<PlusCircle size={32} strokeWidth={1.5} />}
              />
            </div>

            <div>
              <FeatureCard
                title="Read & Search"
                description="Fetch all records or a specific one using email as a query parameter."
                icon={<Search size={32} strokeWidth={1.5} />}
              />
            </div>

            <div>
              <FeatureCard
                title="Update Information"
                description="Modify any field in an existing record using a PUT request."
                icon={<Edit size={32} strokeWidth={1.5} />}
              />
            </div>

            <div className="md:col-span-2">
              <FeatureCard
                title="Delete Records"
                description="Remove entries by targeting the email identifier in a DELETE request."
                icon={<Trash2 size={32} strokeWidth={1.5} />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-3">
              <FeatureCard
                title="Data Visualization"
                description="View friend data visually."
                icon={<BarChart3 size={32} strokeWidth={1.5} />}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}