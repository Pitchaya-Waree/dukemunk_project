'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient'; 
import './Reservation.css';

export default function Reservation() {
  // 1. States สำหรับเก็บข้อมูลโต๊ะจาก Database
  const [tablesData, setTablesData] = useState([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);

  // 2. States สำหรับฟอร์ม (ตั้งค่าเริ่มต้นเป็นค่าว่างไปก่อน เดี๋ยวเราจะดึงเวลาปัจจุบันมาใส่)
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    // --- ตั้งค่า วันที่ และ เวลา ให้เป็นปัจจุบัน (Auto-select current day & time) ---
    const now = new Date();
    // แปลงวันที่เป็นฟอร์แมต YYYY-MM-DD (ใช้ 'en-CA' เพื่อให้ฟอร์แมตถูกต้องแบบ ISO)
    const currentDate = now.toLocaleDateString('en-CA'); 
    // แปลงเวลาเป็นฟอร์แมต HH:MM (ใช้ 'en-GB' เพื่อให้เป็นแบบ 24 ชั่วโมง)
    const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    setDate(currentDate);
    setTime(currentTime);

    // --- ฟังก์ชันดึงข้อมูลโต๊ะจาก Database ---
    const fetchTables = async () => {
      try {
        const { data, error } = await supabase
          .from('tables')
          .select('*')
          .order('id', { ascending: true }); // เรียงตาม ID

        if (error) throw error;

        if (data) {
          // เพิ่มสถานะ available ให้โต๊ะทุกตัว (เพื่อให้คลิกได้และเป็นสีเขียว)
          const tablesWithStatus = data.map(table => ({
            ...table,
            status: 'available' 
          }));
          setTablesData(tablesWithStatus);
        }
      } catch (error) {
        console.error('Error fetching tables:', error.message);
      } finally {
        setLoadingTables(false);
      }
    };

    fetchTables();
  }, []);

  // ฟังก์ชันจัดการตอนคลิกโต๊ะ
  const handleTableClick = (table) => {
    if (table.status === 'available') {
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
          <input 
            type="date" 
            className="form-input" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label className="form-label"><span>🕒</span> Time</label>
          <input 
            type="time" 
            className="form-input" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label className="form-label"><span>👥</span> Number of Guests</label>
          <input 
            type="number" 
            className="form-input" 
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            min="1" 
          />
        </div>

        {selectedTable && (
          <div className="form-group">
            <label className="form-label"><span>📍</span> Selected Table</label>
            <div className="selected-table-container">
              <div className="selected-table-header">
                {/* ⚠️ เปลี่ยนเป็น .table_name เพื่อให้ตรงกับชื่อคอลัมน์ใน Database ของคุณ */}
                <span className="selected-table-name">{selectedTable.table_name}</span>
                <span className="check-icon">✓</span>
              </div>
              <div className="selected-table-subtext">Seats up to {selectedTable.seats} guests</div>
            </div>
          </div>
        )}

        {selectedTable && (
          <button className="btn-confirm">Confirm & Continue</button>
        )}

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
          ส่วนที่ 2: แผนผังด้านขวา (Floor Plan)
      ========================================== */}
      <div className="right-panel">
        <h2 className="panel-title" style={{ textAlign: 'center' }}>Restaurant Floor Plan</h2>

        {/* --- ส่วนที่แสดงจำนวนโต๊ะทั้งหมด --- */}
        {!loadingTables && (
          <p style={{ textAlign: 'center', color: '#cda434', marginBottom: '20px', fontSize: '1.1rem' }}>
            We have a total of <strong>{tablesData.length}</strong> tables available.
          </p>
        )}

        <div className="floor-plan-grid">
          {loadingTables ? (
            <div style={{ color: '#aaa', padding: '40px' }}>Loading tables from database...</div>
          ) : (
            // เราสามารถวนลูป map ครั้งเดียวได้เลย เพราะ CSS .table-row มี flex-wrap: wrap อยู่แล้ว
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
                  {/* ⚠️ เปลี่ยน t.name เป็น t.table_name */}
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