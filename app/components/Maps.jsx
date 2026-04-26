import React from 'react';
import './Maps.css';

export default function Maps() {
  return (
    // ใส่ id="maps" เพื่อให้ Navbar เลื่อนมาหาได้ถูกต้อง
    <section id="maps" className="how-to-container">

      <div className="how-to-header">
        <h2 className="how-to-title">HOW TO GET HERE</h2>
        <div className="how-to-decorative">❦</div>
      </div>

      <div className="how-to-content">
        <ul className="how-to-list">
          <li>
            <span className="highlight-gold">Lorem ipsum dolor sit amet,</span> consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </li>

          <li>
            <span className="highlight-gold">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum:</span>
            <ul className="sub-list">
              <li>Excepteur sint occaecat cupidatat non proident (sunt in culpa qui officia)</li>
              <li>Deserunt mollit anim id est laborum (sed ut perspiciatis unde)</li>
            </ul>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.
          </li>

          <li>
            <span className="highlight-gold">Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet:</span>
            <ul className="sub-list">
              <li>Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam.</li>
              <li>Quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.</li>
            </ul>
          </li>

          <li>
            <span className="highlight-gold">Quis autem vel eum iure reprehenderit: +66 XX XXX XXXX</span>
            <div className="contact-info">
              Lorem ipsum - Dolor sit | 00:00 A.M. - 00:00 P.M.
            </div>
          </li>
        </ul>
      </div>

      {/* Google Maps Embed */}
      <div className="map-container">
        <iframe
          className="google-map-iframe"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27136.15345348452!2d139.93773206291377!3d-66.66211007011694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xaec6c681b100f26f%3A0xec9c22d97d3cd9c8!2zRHVtb250IGQnVXJ2aWxsZSBTdGF0aW9uLCDguYHguK3guJnguJXguLLguKPguYzguIHguJXguLTguIHguLI!5e1!3m2!1sth!2sth!4v1777209906455!5m2!1sth!2sth"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

    </section>
  );
}