'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import NavItems from './NavItems';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full px-4 md:px-8 py-4 flex items-center justify-between bg-white shadow-md sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <Image src="/icons/logo.png" alt="logo" width={50} height={50} />
      </Link>

      {/* Hamburger Icon (Mobile Only) */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-800 focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6">
        <NavItems />
        <SignedOut>
          <SignInButton>
            
 
  <button className="btn-signin !items-center !justify-center">Sign In</button>


            
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      {/* Mobile Nav Menu with Animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute top-[70px] left-0 w-full bg-white shadow-md border-t z-40 md:hidden"
          >
            <div className="flex flex-col items-center gap-6 py-6 px-4">
              <NavItems isMobile />
              <SignedOut>
                <SignInButton>
                  <button className="btn-signin w-full text-center">Sign In</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
