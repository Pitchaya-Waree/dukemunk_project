'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Story from '@/components/Story';
import Reservation from '@/components/Reservation';
import Footer from '@/components/Footer';
import Maps from '@/components/Maps';

export default function MapsPage() {

  return (
    <main>
      <Hero />
      <Navbar />
      {/* <Story /> */}
      {/* <Reservation /> */}
      <Maps />
      <Footer />
    </main>
  );
}