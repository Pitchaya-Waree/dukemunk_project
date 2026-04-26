'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Story from '@/components/Story';
import Reservation from '@/components/Reservation';
import Footer from '@/components/Footer';
import Tables from '@/components/Tables';

export default function TablesPage() {

  return (
    <main>
      <Hero />
      <Navbar />
      {/* <Story /> */}
      {/* <Reservation /> */}
      <Tables />
      <Footer />
    </main>
  );
}