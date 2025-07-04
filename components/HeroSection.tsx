'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const typingTexts = [
  'Real-time voice conversations.',
  'Personalized AI tutoring.',
  'Learning made fun and smart.',
];

const HeroSection = () => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % typingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-[100vw] h-[100vh] py-20 px-6 md:px-16 bg-gradient-to-br from-[#f9f6ff] via-[#f0f8ff] to-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <h1 className="text-8xl mt-20 mb-0 min-md:text-6xl font-bold leading-tight text-gray-900">
            Learn Smarter with
          </h1>
          <h1 className="text-8xl mb-20 md:text-6xl font-bold leading-tight text-gray-900">
           NeoTutor
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0 min-h-[72px]">
            {typingTexts[textIndex]}
          </p>
          <p className="mt-2 text-base text-gray-600 max-w-xl mx-auto lg:mx-0">
            Create your own AI learning companion and have real-time <strong>voice conversations</strong> on any topic.
            It’s like talking to a smart tutor — personalized, interactive, and always available.
          </p>
          <div className="mt-8 flex justify-center lg:justify-start gap-4">
            <Link href="/companions/new">
              <button className="btn-primary flex items-center gap-2">
                <Image src="/icons/plus.svg" alt="plus" width={14} height={14} />
                <span>Build a New Companion</span>
              </button>
            </Link>
            <Link href="/companions">
              <button className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:border-black hover:text-black transition">
                Explore Companions
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Right Lottie Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          <Image
          src="/images/aipic.png"
          alt="ai"
          width={2000}
          height={2000}
          
          />
        </motion.div>
      </div>

      {/* Background Shapes */}
      <div className="absolute top-[-5rem] right-[-5rem] w-[300px] h-[300px] bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-[-5rem] left-[-5rem] w-[250px] h-[250px] bg-yellow-100 rounded-full opacity-30 blur-2xl"></div>
    </section>
  );
};

export default HeroSection;
