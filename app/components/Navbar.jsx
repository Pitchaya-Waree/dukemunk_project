import React from 'react';
import './Navbar.css';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  return (
    <div id="navbar" className="navbar">
      <div className="grow">
        <a href="/" className='btn-explore'>OUR STORY</a>
      </div>
      <div className="grow">
        <a href="/pages/tables" className='btn-explore'>AVAILABLE TABLE</a>
      </div>
      <div className="grow">
        <a href="/pages/reservation" className='btn-explore'>RESERVATION</a>
      </div><div className="grow">
        <a href="/pages/maps" className='btn-explore'>HOW TO GET HERE</a>
      </div><div className="grow">
        <a href="/pages/login" className='btn-explore'>LOGIN</a>
      </div>
    </div>
  );
}