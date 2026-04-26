'use client';
import React, { useState } from 'react';
import './TableSelction.css';

// ----------------------------------------------------
// ข้อมูลจำลอง (Mock Data) สำหรับโต๊ะทั้งหมด
// ----------------------------------------------------
const tableData = [
  // แถว 1
  { id: 1, name: 'Table 1', seats: 2, shape: 'round', status: 'available' },
  { id: 2, name: 'Table 2', seats: 2, shape: 'round', status: 'occupied' },
  { id: 3, name: 'Table 3', seats: 2, shape: 'round', status: 'available' },
  { id: 4, name: 'Table 4', seats: 2, shape: 'round', status: 'reserved' },
  { id: 5, name: 'Table 5', seats: 2, shape: 'round', status: 'available' },
  // แถว 2
  { id: 6, name: 'Table 6', seats: 4, shape: 'square', status: 'available' },
  { id: 7, name: 'Table 7', seats: 4, shape: 'square', status: 'available' },
  { id: 8, name: 'Table 8', seats: 4, shape: 'square', status: 'reserved' },
  { id: 9, name: 'Table 9', seats: 4, shape: 'square', status: 'available' },
  // แถว 3
  { id: 10, name: 'Table 10', seats: 4, shape: 'square', status: 'available' },
  { id: 11, name: 'Table 11', seats: 4, shape: 'square', status: 'available' },
  { id: 12, name: 'Table 12', seats: 4, shape: 'square', status: 'occupied' },
  { id: 13, name: 'Table 13', seats: 4, shape: 'square', status: 'available' },
  // แถว 4
  { id: 14, name: 'VIP 1', seats: 6, shape: 'vip', status: 'available' },
  { id: 15, name: 'VIP 2', seats: 6, shape: 'vip', status: 'available' },
  { id: 16, name: 'VIP 3', seats: 8, shape: 'vip', status: 'reserved' },
];

export default function TablesPage() {
  // สร้าง State ไว้เก็บโต๊ะที่ผู้ใช้กำลังเลือก (ค่าเริ่มต้นเป็น null)
  const [selectedTable, setSelectedTable] = useState(null);

  // ฟังก์ชันจัดการตอนคลิกโต๊ะ
  const handleTableClick = (table) => {
    // ให้คลิกได้เฉพาะโต๊ะที่ Available เท่านั้น
    if (table.status === 'available') {
      // ถ้าคลิกโต๊ะเดิมซ้ำ ให้ยกเลิกการเลือก (เปลี่ยนเป็น null)
      if (selectedTable?.id === table.id) {
        setSelectedTable(null);
      } else {
        setSelectedTable(table);
      }
    }
  };

  return (
    <div className="reservation-container">
      
      {/* ==========================================
          ส่วนที่ 1: แผงด้านซ้าย (ฟอร์มและข้อมูลโต๊ะ)
      ========================================== */}
      <div className="left-panel">
        <h2 className="panel-title">Reservation Details</h2>
        
        <div className="form-group">
          <label className="form-label"><span>📅</span> Date</label>
          <input type="text" className="form-input" defaultValue="03/01/2026" />
        </div>

        <div className="form-group">
          <label className="form-label"><span>🕒</span> Time</label>
          <input type="text" className="form-input" defaultValue="07:00 PM" />
        </div>

        <div className="form-group">
          <label className="form-label"><span>👥</span> Number of Guests</label>
          <input type="number" className="form-input" defaultValue="2" min="1" />
        </div>

        {/* --- โชว์ส่วนนี้เฉพาะเมื่อมีการเลือกโต๊ะแล้ว (selectedTable ไม่ใช่ null) --- */}
        {selectedTable && (
          <div className="form-group">
            <label className="form-label"><span>📍</span> Selected Table</label>
            <div className="selected-table-container">
              <div className="selected-table-header">
                <span className="selected-table-name">{selectedTable.name}</span>
                <span className="check-icon">✓</span>
              </div>
              <div className="selected-table-subtext">Seats up to {selectedTable.seats} guests</div>
            </div>
          </div>
        )}

        {/* --- โชว์ปุ่ม Confirm เฉพาะเมื่อเลือกโต๊ะแล้ว --- */}
        {selectedTable && (
          <button className="btn-confirm">Confirm & Continue</button>
        )}

        {/* เส้นคั่น จะอยู่ติดข้างบนถ้ายังไม่ได้เลือกโต๊ะ หรือโดนดันลงมาถ้าเลือกแล้ว */}
        <div className="divider" style={{ marginTop: selectedTable ? '0' : '32px' }}></div>

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

      {/* ==========================================
          ส่วนที่ 2: แผนผังด้านขวา
      ========================================== */}
      <div className="right-panel">
        <h2 className="panel-title" style={{ textAlign: 'center' }}>Restaurant Floor Plan</h2>
        
        <div className="floor-plan-grid">
          
          {/* สร้างแถวที่ 1-5 */}
          <div className="table-row">
            {tableData.slice(0, 5).map(t => (
              <div 
                key={t.id} 
                // เช็คว่าไอดีโต๊ะตรงกับที่ถูกเลือกไหม ถ้าใช่ให้ใส่คลาส table-selected
                className={`table 
                  ${t.shape === 'round' ? 'table-round' : t.shape === 'vip' ? 'table-vip' : 'table-square'} 
                  status-${t.status} 
                  ${selectedTable?.id === t.id ? 'table-selected' : ''}`
                }
                onClick={() => handleTableClick(t)} // เรียกฟังก์ชันเมื่อถูกคลิก
              >
                <div className="table-name">{t.name}</div>
                <div className="table-seats">{t.seats} seats</div>
              </div>
            ))}
          </div>

          <div className="table-row">
            {tableData.slice(5, 9).map(t => (
              <div 
                key={t.id} 
                className={`table table-square status-${t.status} ${selectedTable?.id === t.id ? 'table-selected' : ''}`}
                onClick={() => handleTableClick(t)}
              >
                <div className="table-name">{t.name}</div>
                <div className="table-seats">{t.seats} seats</div>
              </div>
            ))}
          </div>

          <div className="table-row">
            {tableData.slice(9, 13).map(t => (
              <div 
                key={t.id} 
                className={`table table-square status-${t.status} ${selectedTable?.id === t.id ? 'table-selected' : ''}`}
                onClick={() => handleTableClick(t)}
              >
                <div className="table-name">{t.name}</div>
                <div className="table-seats">{t.seats} seats</div>
              </div>
            ))}
          </div>

          <div className="table-row">
            {tableData.slice(13, 16).map(t => (
              <div 
                key={t.id} 
                className={`table table-vip status-${t.status} ${selectedTable?.id === t.id ? 'table-selected' : ''}`}
                onClick={() => handleTableClick(t)}
              >
                <div className="table-name">{t.name}</div>
                <div className="table-seats">{t.seats} seats</div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}