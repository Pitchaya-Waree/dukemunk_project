'use client'; // ต้องมีคำนี้เพราะเราใช้ useState ใน Reservation
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Reservation from '@/components/Reservation';

export default function RestaurantPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Reservation />
      {/* คุณสามารถเพิ่มส่วนอื่นๆ เช่น Menu หรือ Gallery ได้ที่นี่ */}
    </main>
  );
}