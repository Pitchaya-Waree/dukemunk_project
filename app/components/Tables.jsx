'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient'; 
import './Tables.css';

// Component สำหรับสร้างโต๊ะ 1 ตัว
const TableComponent = ({ name, seats, shape, status }) => {
  const shapeClass = shape === 'round' ? 'table-round' : shape === 'vip' ? 'table-vip' : 'table-square';
  // นำ status ที่เช็คแล้วมาใส่เป็นคลาสสี (available = เขียว, reserved = เหลือง, occupied = แดง)
  const statusClass = `status-${status || 'available'}`;

  return (
    <div className={`table ${shapeClass} ${statusClass}`}>
      <div className="table-name">{name}</div>
      <div className="table-seats">{seats} seats</div>
    </div>
  );
};

export default function Table() {
  // State เก็บข้อมูลโต๊ะ: ใช้เก็บ Array ข้อมูลโต๊ะที่ดึงมาจาก Database 
  const [tablesData, setTablesData] = useState([]);
  
  // State สถานะการโหลด: ตรวจสอบว่าระบบกำลังดึงข้อมูลอยู่หรือไม่ (true = กำลังโหลด, false = โหลดเสร็จ)
  const [loading, setLoading] = useState(true);

  // State ฟิลเตอร์วันที่: เก็บค่าวันที่ที่ผู้ใช้ต้องการดูสถานะโต๊ะ (รูปแบบ YYYY-MM-DD)
  const [filterDate, setFilterDate] = useState('');
  
  // State ฟิลเตอร์เวลา: เก็บค่าเวลาที่ผู้ใช้ต้องการดู (ค่าตั้งต้นคือ '11:00:00' ต้องมีวินาทีเพื่อไปเช็คใน DB)
  const [filterTime, setFilterTime] = useState('11:00:00'); 

  // EFFECTS (การทำงานอัตโนมัติ)

  // Effect 1: ตั้งค่าวันที่เริ่มต้นให้เป็นวันปัจจุบัน เมื่อเปิดหน้าเว็บครั้งแรก
  useEffect(() => {
    const now = new Date();
    setFilterDate(now.toLocaleDateString('en-CA'));
  }, []);

  // Effect 2: ดึงข้อมูลโต๊ะ และเช็คการจองใหม่ทุกครั้งที่ Date หรือ Time เปลี่ยนแปลง
  useEffect(() => {
    const fetchTablesAndStatus = async () => {
      if (!filterDate) return; 
      setLoading(true);

      try {
        // ดึงข้อมูลโต๊ะทั้งหมด
        const { data: tables, error: tablesError } = await supabase
          .from('tables')
          .select('*');

        if (tablesError) throw tablesError;

        // ดึงข้อมูลการจอง "เฉพาะวันที่และเวลาที่ถูกเลือกในฟิลเตอร์"
        const { data: reservations, error: resError } = await supabase
          .from('reservations')
          .select('*')
          .eq('reservation_date', filterDate)
          .eq('reservation_time', filterTime); 

        if (resError) throw resError;

        // ประมวลผลสถานะโต๊ะ
        if (tables) {
          const tablesWithStatus = tables.map(table => {
            const booking = reservations.find(res => res.table_id === table.id);
            let currentStatus = 'available'; // Default สีเขียว
            
            if (booking) {
              // รองรับสถานะ pending และ confirmed ให้ออกมาเป็นสีเหลือง (จองแล้ว)
              if (booking.status === 'confirmed' || booking.status === 'pending') {
                currentStatus = 'reserved';
              } else if (booking.status === 'seated') {
                currentStatus = 'occupied';
              }
            }
            return { ...table, status: currentStatus };
          });

          // จัดเรียง Table 1-10 แบบธรรมชาติ
          const sortedData = tablesWithStatus.sort((a, b) => 
            a.table_name.localeCompare(b.table_name, undefined, { numeric: true })
          );
          setTablesData(sortedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTablesAndStatus();
  }, [filterDate, filterTime]);

  // RENDER UI
  return (
    <div className="page-container">
      <div className="right-panel">
        <h2 className="panel-title">Restaurant Floor Plan</h2>

        {/* แถบเครื่องมือสำหรับเลือกวันและเวลา (ใช้ CSS Class แทน Inline Style) */}
        <div className="filter-container">
          <div className="filter-group">
            <label className="filter-label">Date:</label>
            <input 
              type="date" 
              className="filter-input"
              value={filterDate} 
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Time:</label>
            <select 
              className="filter-input"
              value={filterTime} 
              onChange={(e) => setFilterTime(e.target.value)}
            >
              <option value="11:00:00">11:00 AM - 02:00 PM</option>
              <option value="17:00:00">05:00 PM - 08:00 PM</option>
            </select>
          </div>
        </div>
        
        {/* แผนผังโต๊ะ */}
        <div className="floor-plan-grid">
          {loading ? (
            <div className="loading-text">Loading tables status...</div>
          ) : (
            <div className="table-row">
              {tablesData.map(t => (
                <TableComponent 
                  key={t.id} 
                  name={t.table_name} 
                  seats={t.seats} 
                  shape={t.shape} 
                  status={t.status} 
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}