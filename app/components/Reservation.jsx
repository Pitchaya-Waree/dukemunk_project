import React from 'react';
import './Reservation.css'; // อย่าลืม import ไฟล์ css
import Table from './Tables';

export default function ReservationDetails() {
  return (
    <div className="left-panel">
      <h2 className="panel-title">Reservation Details</h2>
      
      <div className="form-group">
        <label className="form-label">
          <span>📅</span> Date
        </label>
        {/* ในการใช้งานจริงอาจจะเปลี่ยน type="text" เป็น type="date" */}
        <input type="text" className="form-input" defaultValue="03/01/2026" />
      </div>

      <div className="form-group">
        <label className="form-label">
          <span>🕒</span> Time
        </label>
        {/* ในการใช้งานจริงอาจจะเปลี่ยน type="text" เป็น type="time" */}
        <input type="text" className="form-input" defaultValue="07:00 PM" />
      </div>

      <div className="form-group">
        <label className="form-label">
          <span>👥</span> Number of Guests
        </label>
        <input type="number" className="form-input" defaultValue="2" min="1" />
      </div>

      {/* --- ส่วนที่เพิ่มมาใหม่: แสดงโต๊ะที่ถูกเลือก --- */}
      <div className="form-group">
        <label className="form-label">
          <span>📍</span> Selected Table
        </label>
        <div className="selected-table-container">
          <div className="selected-table-header">
            <span className="selected-table-name">Table 1</span>
            <span className="check-icon">✓</span>
          </div>
          <div className="selected-table-subtext">Seats up to 2 guests</div>
        </div>
      </div>

      {/* ปุ่มแบบใหม่ */}
      <button className="btn-confirm">Confirm & Continue</button>

      <div className="divider"></div>

      {/* ส่วนอธิบายสถานะสี */}
      <h3 className="status-title">Table Status</h3>
      <div className="status-list">
        <div className="status-item">
          <div className="status-dot" style={{ backgroundColor: '#2ecc71' }}></div>
          <span>Available</span>
        </div>
        <div className="status-item">
          <div className="status-dot" style={{ backgroundColor: '#f1c40f' }}></div>
          <span>Reserved</span>
        </div>
        <div className="status-item">
          <div className="status-dot" style={{ backgroundColor: '#e74c3c' }}></div>
          <span>Occupied</span>
        </div>
      </div>
      
    </div>
  );
}