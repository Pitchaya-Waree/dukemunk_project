'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import './Reservation.css';

export default function Reservation() {
  // STATES MANAGEMENT (การจัดการข้อมูลและสถานะ)

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null); // เก็บข้อมูลผู้ใช้ที่กำลังล็อกอินอยู่

  // Data States (ข้อมูลจาก Database)
  const [tablesData, setTablesData] = useState([]); // เก็บรายการโต๊ะและสถานะ
  const [loadingTables, setLoadingTables] = useState(true); 

  // Form States (ข้อมูลที่ผู้ใช้เลือก)
  const [selectedTable, setSelectedTable] = useState(null); // เก็บโต๊ะที่ผู้ใช้คลิกเลือก
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2); // จำนวนแขก (ค่าเริ่มต้นคือ 2 คน)

  // UI States
  const [showPopup, setShowPopup] = useState(false); // ควบคุมการเปิด/ปิดหน้าต่าง Popup ยืนยัน
  const [isSubmitting, setIsSubmitting] = useState(false); // ป้องกันผู้ใช้กดปุ่ม Confirm ซ้ำตอนกำลังโหลด

  // Effect โหลดข้อมูล User และตั้งค่า วันที่/เวลา เริ่มต้น (ทำงานครั้งเดียวตอนเปิดหน้าเว็บ)
  useEffect(() => {
    const initializePage = async () => {
      // เช็ค User
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setCurrentUser(session.user);

      // ตั้งค่าว้นที่ปัจจุบัน และรอบเวลาแรก (11:00:00)
      const now = new Date();
      setDate(now.toLocaleDateString('en-CA'));
      setTime('11:00:00');
    };

    initializePage();
  }, []);

  // Effect ดึงข้อมูลโต๊ะ และข้อมูลการจอง (ทำงานทุกครั้งที่ตัวแปร date หรือ time เปลี่ยน)
  useEffect(() => {
    const fetchTablesAndReservations = async () => {
      if (!date || !time) return;

      setLoadingTables(true);
      setSelectedTable(null); // รีเซ็ตโต๊ะที่เลือกไว้ หากมีการเปลี่ยนเวลา

      try {
        // ดึงข้อมูลตาราง tables และ reservations พร้อมกัน
        const [
          { data: tables, error: tablesError },
          { data: reservations, error: resError }
        ] = await Promise.all([
          supabase.from('tables').select('*'),
          supabase.from('reservations').select('*').eq('reservation_date', date).eq('reservation_time', time)
        ]);

        if (tablesError) throw tablesError;
        if (resError) throw resError;

        if (tables) {
          const reservationMap = reservations.reduce((acc, res) => {
            acc[res.table_id] = res;
            return acc;
          }, {});

          // อัปเดตสถานะให้โต๊ะแต่ละตัว
          const tablesWithStatus = tables.map(table => {
            const booking = reservationMap[table.id]; // ค้นหาแบบ O(1) เร็วปรู๊ด
            let currentStatus = 'available';

            if (booking) {
              if (booking.status === 'confirmed' || booking.status === 'pending') {
                currentStatus = 'reserved';
              } else if (booking.status === 'seated') {
                currentStatus = 'occupied';
              }
            }
            return { ...table, status: currentStatus };
          });

          // เรียงลำดับชื่อ Table 1 ไป Table 10 ให้ถูกต้อง
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
  }, [date, time]);

  // HANDLERS
  const handleTableClick = (table) => {
    if (table.status !== 'available') return; // บล็อกโต๊ะที่ถูกจองแล้ว

    // ถ้ากดโต๊ะเดิมซ้ำ ให้ยกเลิกการเลือก ถ้ากดโต๊ะใหม่ ให้เปลี่ยนไปเลือกโต๊ะนั้น
    setSelectedTable(prev => prev?.id === table.id ? null : table);
  };

  // จัดการการเปิด Popup ยืนยันการจอง
  const handleOpenPopup = () => {
    if (!currentUser) {
      alert('Please log in before making a reservation.');
      return;
    }
    setShowPopup(true);
  };

  // จัดการบันทึกข้อมูลลงฐานข้อมูลเมื่อกดยืนยันใน Popup
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('reservations')
        .insert([{
          user_id: currentUser.id,
          table_id: selectedTable.id,
          reservation_date: date,
          reservation_time: time,
          guest_count: parseInt(guests),
          status: 'confirmed'
        }]);

      if (error) throw error;

      // อัปเดต UI ทันที เปลี่ยนโต๊ะที่เพิ่งจองเป็นสีเหลือง
      setTablesData(prevData =>
        prevData.map(t => t.id === selectedTable.id ? { ...t, status: 'reserved' } : t)
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

  // RENDER UI (การวาดหน้าจอ)
  return (
    <div className="reservation-container">

          {/* MODAL: Popup ยืนยันการจอง */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3 className="popup-title">Confirm Reservation?</h3>
            <div className="popup-text">
              <p><strong>Table:</strong> {selectedTable?.table_name}</p>
              <p>
                <strong>Date:</strong> {date} <br />
                <strong>Time:</strong> {time === '11:00:00' ? '11:00 AM - 02:00 PM' : '05:00 PM - 08:00 PM'}
              </p>
              <p><strong>Guests:</strong> {guests} People</p>
            </div>
            <div className="popup-buttons">
              <button className="btn-cancel" onClick={() => setShowPopup(false)} disabled={isSubmitting}>
                Cancel
              </button>
              <button className="btn-confirm-popup" onClick={handleConfirmBooking} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Yes, Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

          {/* LEFT PANEL: แบบฟอร์มการจอง */}
      <div className="left-panel">
        <h2 className="panel-title">Reservation Details</h2>

        {currentUser && (
          <p style={{ color: '#2ecc71', fontSize: '0.85rem', margin: '-16px 0 24px 0' }}>
            ✓ Logged in as: {currentUser.email}
          </p>
        )}

        <div className="form-group">
          <label className="form-label"><span>📅</span> Date</label>
          <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label"><span>🕒</span> Time</label>
          <select className="form-input" value={time} onChange={(e) => setTime(e.target.value)}>
            <option value="11:00:00">11:00 AM - 02:00 PM</option>
            <option value="17:00:00">05:00 PM - 08:00 PM</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label"><span>👥</span> Number of Guests</label>
          <input type="number" className="form-input" value={guests} onChange={(e) => setGuests(e.target.value)} min="1" />
        </div>

        {/* ข้อมูลโต๊ะที่ถูกเลือก */}
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

          {/* RIGHT PANEL: แผนผังโต๊ะ */}
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
              {tablesData.map(t => {
                // คำนวณ CSS Class ของโต๊ะแต่ละตัว (แยกตัวแปรให้ดูง่ายขึ้น)
                const shapeClass = t.shape === 'round' ? 'table-round' : t.shape === 'vip' ? 'table-vip' : 'table-square';
                const statusClass = `status-${t.status}`;
                const selectedClass = selectedTable?.id === t.id ? 'table-selected' : '';

                return (
                  <div
                    key={t.id}
                    className={`table ${shapeClass} ${statusClass} ${selectedClass}`}
                    onClick={() => handleTableClick(t)}
                  >
                    <div className="table-name">{t.table_name}</div>
                    <div className="table-seats">{t.seats} seats</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}