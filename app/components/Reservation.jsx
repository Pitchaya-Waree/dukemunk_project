'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient'; 
import './Reservation.css';

export default function Reservation() {
  // --- States ---
  const [currentUser, setCurrentUser] = useState(null); // เก็บข้อมูลคนล็อกอิน
  const [tablesData, setTablesData] = useState([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);

  const [showPopup, setShowPopup] = useState(false); // ควบคุมการโชว์ Popup
  const [isSubmitting, setIsSubmitting] = useState(false); // ควบคุมปุ่มตอนกำลังบันทึก

  // 1. ตรวจสอบ User และตั้งค่าว้น/เวลาเริ่มต้นตอนเปิดหน้าเว็บ
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
      }
    };
    checkUser();

    const now = new Date();
    setDate(now.toLocaleDateString('en-CA')); // เซ็ตเป็นวันปัจจุบัน
    setTime('11:00'); // เซ็ตเป็นรอบ 11:00 AM
  }, []);

  // 2. ดึงข้อมูลโต๊ะ และเช็คการจองตาม "วันและเวลา" ที่เลือก
  // ระบบจะทำงานใหม่ทันทีที่ผู้ใช้เปลี่ยน Date หรือ Time
  useEffect(() => {
    const fetchTablesAndReservations = async () => {
      if (!date || !time) return; // ต้องรอให้มีค่าวัน/เวลาครบก่อน
      
      setLoadingTables(true);
      setSelectedTable(null); // ยกเลิกการเลือกโต๊ะเก่าเมื่อผู้ใช้เปลี่ยนเวลา

      try {
        // ดึงข้อมูลโต๊ะทั้งหมด
        const { data: tables, error: tablesError } = await supabase
          .from('tables')
          .select('*');
        
        if (tablesError) throw tablesError;

        // ดึงข้อมูลการจอง **เฉพาะวันและเวลาที่เลือกบนหน้าจอ**
        const { data: reservations, error: resError } = await supabase
          .from('reservations')
          .select('*')
          .eq('reservation_date', date)
          .eq('reservation_time', time);
        
        if (resError) throw resError;

        // นำข้อมูลโต๊ะมาคำนวณสถานะใหม่
        if (tables) {
          const tablesWithStatus = tables.map(table => {
            // เช็คว่ามีคนจองโต๊ะ id นี้ ในวันและเวลานี้หรือไม่?
            const booking = reservations.find(res => res.table_id === table.id);
            
            let currentStatus = 'available'; // สีเขียว
            
            if (booking) {
              if (booking.status === 'confirmed') {
                currentStatus = 'reserved'; // สีเหลือง
              } else if (booking.status === 'seated') {
                currentStatus = 'occupied'; // สีแดง
              }
            }

            return {
              ...table,
              status: currentStatus 
            };
          });

          // จัดเรียง Table 1 ไปจนถึง Table 10 ให้ถูกต้อง
          const sortedData = tablesWithStatus.sort((a, b) => 
            a.table_name.localeCompare(b.table_name, undefined, { numeric: true })
          );
          setTablesData(sortedData);
        }
      } catch (error) {
        console.error('Error fetching tables:', error.message);
      } finally {
        setLoadingTables(false);
      }
    };

    fetchTablesAndReservations();
  }, [date, time]); // <--- ตัวแปรนี้คือหัวใจสำคัญ! เมื่อ date หรือ time เปลี่ยน โค้ดจะดึงข้อมูลมาเปลี่ยนสีโต๊ะใหม่ทันที

  // ฟังก์ชันคลิกเลือกโต๊ะ (คลิกได้เฉพาะโต๊ะว่าง)
  const handleTableClick = (table) => {
    if (table.status === 'available') {
      if (selectedTable?.id === table.id) {
        setSelectedTable(null);
      } else {
        setSelectedTable(table);
      }
    }
  };

  const handleOpenPopup = () => {
    if (!currentUser) {
      alert('Please log in before making a reservation.');
      return;
    }
    setShowPopup(true);
  };

  // ฟังก์ชันบันทึกข้อมูลการจอง
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('reservations')
        .insert([
          {
            user_id: currentUser.id,
            table_id: selectedTable.id,
            reservation_date: date,
            reservation_time: time,
            guest_count: parseInt(guests),
            status: 'confirmed' 
          }
        ]);

      if (error) throw error;

      // เมื่อจองเสร็จ เปลี่ยนสีโต๊ะที่เพิ่งจองให้เป็นสีเหลืองทันที
      setTablesData(prevData => 
        prevData.map(t => 
          t.id === selectedTable.id ? { ...t, status: 'reserved' } : t
        )
      );

      setSelectedTable(null);
      setShowPopup(false);
      alert('Reservation successful!');

    } catch (error) {
      console.error('Error saving reservation:', error.message);
      alert('Failed to make a reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reservation-container">
      
      {/* Popup ยืนยันการจอง */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3 className="popup-title">Confirm Reservation?</h3>
            <div className="popup-text">
              <p><strong>Table:</strong> {selectedTable?.table_name}</p>
              <p>
                <strong>Date:</strong> {date} <br/>
                <strong>Time:</strong> {time === '11:00' ? '11:00 AM - 02:00 PM' : '05:00 PM - 08:00 PM'}
              </p>
              <p><strong>Guests:</strong> {guests} People</p>
            </div>
            <div className="popup-buttons">
              <button 
                className="btn-cancel" 
                onClick={() => setShowPopup(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm-popup" 
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Yes, Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="left-panel">
        <h2 className="panel-title">Reservation Details</h2>
        
        {currentUser && (
          <p style={{ color: '#2ecc71', fontSize: '0.85rem', margin: '-16px 0 24px 0' }}>
            ✓ Logged in as: {currentUser.email}
          </p>
        )}

        <div className="form-group">
          <label className="form-label"><span>📅</span> Date</label>
          {/* เมื่อผู้ใช้เลือกวันที่ใหม่ State date จะถูกเปลี่ยน และไปสั่งให้ useEffect ดึงข้อมูลโต๊ะใหม่ */}
          <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label"><span>🕒</span> Time</label>
          <select className="form-input" value={time} onChange={(e) => setTime(e.target.value)}>
            <option value="11:00">11:00 AM - 02:00 PM</option>
            <option value="17:00">05:00 PM - 08:00 PM</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label"><span>👥</span> Number of Guests</label>
          <input type="number" className="form-input" value={guests} onChange={(e) => setGuests(e.target.value)} min="1" />
        </div>

        {selectedTable && (
          <div className="form-group">
            <label className="form-label"><span>📍</span> Selected Table</label>
            <div className="selected-table-container">
              <div className="selected-table-header">
                <span className="selected-table-name">{selectedTable.table_name}</span>
                <span className="check-icon">✓</span>
              </div>
              <div className="selected-table-subtext">Seats up to {selectedTable.seats} guests</div>
            </div>
          </div>
        )}

        {selectedTable && (
          <button className="btn-confirm" onClick={handleOpenPopup}>Confirm & Continue</button>
        )}

        <div className="divider" style={{ marginTop: selectedTable ? '0' : '32px' }}></div>

        <h3 className="status-title">Table Status</h3>
        <div className="status-list">
          <div className="status-item"><div className="status-dot" style={{ backgroundColor: '#2ecc71' }}></div><span>Available</span></div>
          <div className="status-item"><div className="status-dot" style={{ backgroundColor: '#f1c40f' }}></div><span>Reserved</span></div>
          <div className="status-item"><div className="status-dot" style={{ backgroundColor: '#e74c3c' }}></div><span>Occupied</span></div>
        </div>
      </div>

      <div className="right-panel">
        <h2 className="panel-title" style={{ textAlign: 'center' }}>Restaurant Floor Plan</h2>
        {!loadingTables && (
          <p style={{ textAlign: 'center', color: '#cda434', marginBottom: '20px', fontSize: '1.1rem' }}>
            We have a total of <strong>{tablesData.length}</strong> tables available.
          </p>
        )}

        <div className="floor-plan-grid">
          {loadingTables ? (
            <div style={{ color: '#aaa', padding: '40px' }}>Loading tables from database...</div>
          ) : (
            <div className="table-row">
              {tablesData.map(t => (
                <div
                  key={t.id}
                  className={`table 
                    ${t.shape === 'round' ? 'table-round' : t.shape === 'vip' ? 'table-vip' : 'table-square'} 
                    status-${t.status} 
                    ${selectedTable?.id === t.id ? 'table-selected' : ''}`
                  }
                  onClick={() => handleTableClick(t)}
                >
                  <div className="table-name">{t.table_name}</div>
                  <div className="table-seats">{t.seats} seats</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}