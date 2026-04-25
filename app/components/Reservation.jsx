import React, { useState } from 'react';
import './Reservation.css';

export default function Reservation() {
  const [booking, setBooking] = useState({
    date: '',
    time: '',
    guests: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`ยืนยันการจองวันที่ ${booking.date} เวลา ${booking.time} สำหรับ ${booking.guests} ท่าน`);
  };

  return (
    <section id="reserve" className="reservation">
      <h2>Make a Reservation</h2>
      <form onSubmit={handleSubmit} className="res-form">
        <input 
          type="date" 
          onChange={(e) => setBooking({...booking, date: e.target.value})}
          required 
        />
        <input 
          type="time" 
          onChange={(e) => setBooking({...booking, time: e.target.value})}
          required 
        />
        <input 
          type="number" 
          placeholder="จำนวนแขก" 
          min="1" 
          onChange={(e) => setBooking({...booking, guests: e.target.value})}
          required 
        />
        <button type="submit">Confirm Booking</button>
      </form>
    </section>
  );
}