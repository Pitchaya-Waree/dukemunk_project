import React from 'react';
import './Navbar.css';

export default function Navbar() {
  return (
    <div id="navbar" className="navbar">
      {/* <div className="logo">DUKEMUNK DINING</div> */}
      <div className="grow">
        <a href="#home" className='btn-explore'>OUR STORY</a>
      </div>
      <div className="grow">
        <a href="#table" className='btn-explore'>AVAILABLE TABLE</a>
      </div>
      <div className="grow">
        <a href="#reservation" className='btn-explore'>RESERVATION</a>
      </div><div className="grow">
        <a href="#maps" className='btn-explore'>HOW TO GET HERE</a>
      </div>
    </div>


  );
}