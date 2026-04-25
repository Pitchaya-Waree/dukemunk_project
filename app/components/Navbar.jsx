import React from 'react';
import './Navbar.css';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  
  return (
    <div id="navbar" className="navbar">
      <div className="grow">
        <a href="#home" className='btn-explore'>OUR STORY</a>
      </div>
      <div className="grow">
        <a href="#tables" className='btn-explore'>AVAILABLE TABLE</a>
      </div>
      <div className="grow">
        <a href="#reservation" className='btn-explore'>RESERVATION</a>
      </div><div className="grow">
        <a href="#maps" className='btn-explore'>HOW TO GET HERE</a>
      </div>
    </div>
  );
}