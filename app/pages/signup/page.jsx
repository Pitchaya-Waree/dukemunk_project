    'use client'; // ต้องมีคำนี้เพราะเราใช้ useState ใน Reservation
import SignupPage from '@/components/Signup';
import React from 'react';


export default function RestaurantPage() {

  return (
    <main>
        <SignupPage />
    </main>
  );
}