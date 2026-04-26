import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-background">
                <img 
                    src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80" 
                    alt="Restaurant interior" 
                    className="footer-bg-img"
                />
            </div>
            
            <div className="footer-content">
                <div className="footer-info">
                    {/* <h2>Duke Munk Dining</h2>
                    <p>Experience authentic Thai cuisine in a cozy atmosphere</p>
                    <p className="footer-hours">Lorem ipsum - Dolor sit | 00:00 A.M. - 00:00 P.M.</p> */}
                </div>

                <p className="footer-copyright">&copy; 2026 Duke Munk. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
