'use client';
import React, { useState, useEffect } from 'react';
// ⚠️ อย่าลืมแก้ Path ของ supabaseClient ให้ตรงกับโฟลเดอร์ในโปรเจกต์ของคุณ
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
  const [tablesData, setTablesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // States สำหรับค้นหาสถานะ
  const [filterDate, setFilterDate] = useState('');
  const [filterTime, setFilterTime] = useState('11:00'); // Default เป็นรอบแรก

  // ตั้งค่าวันที่เริ่มต้นให้เป็นวันปัจจุบัน
  useEffect(() => {
    const now = new Date();
    setFilterDate(now.toLocaleDateString('en-CA')); // รูปแบบ YYYY-MM-DD
  }, []);

  // ดึงข้อมูลโต๊ะ และข้อมูลการจอง เมื่อวันที่หรือเวลาถูกเปลี่ยน
  useEffect(() => {
    const fetchTablesAndStatus = async () => {
      if (!filterDate) return; // ถ้ายังไม่มีวันที่ ให้รอไปก่อน
      setLoading(true);

      try {
        //ดึงข้อมูลโต๊ะทั้งหมด
        const { data: tables, error: tablesError } = await supabase
          .from('tables')
          .select('*');

        if (tablesError) throw tablesError;

        //ดึงข้อมูลการจอง "เฉพาะวันที่และเวลาที่เลือก"
        const { data: reservations, error: resError } = await supabase
          .from('reservations')
          .select('*')
          .eq('reservation_date', filterDate)
          .eq('reservation_time', filterTime); // ดึงเฉพาะเวลา 11:00 หรือ 17:00

        if (resError) throw resError;

        // 3. นำข้อมูลโต๊ะ มาเทียบกับการจองเพื่อหาสถานะ
        if (tables) {
          const tablesWithStatus = tables.map(table => {
            // หาว่าโต๊ะตัวนี้ มีคนจองในรอบเวลานี้หรือไม่
            const booking = reservations.find(res => res.table_id === table.id);
            
            return {
              ...table,
              // ถ้ามีข้อมูลการจอง ให้ใช้สถานะจากตาราง reservations, ถ้าไม่มีแปลว่าว่าง (available)
              status: booking ? booking.status : 'available'
            };
          });

          // จัดเรียงข้อมูลแบบธรรมชาติ
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
  }, [filterDate, filterTime]); // useEffect ทำงานใหม่ทุกครั้งที่ Date หรือ Time เปลี่ยน

  return (
    <div className="page-container">
      <div className="right-panel">
        <h2 className="panel-title">Restaurant Floor Plan</h2>

        {/* --- ส่วนแถบเครื่องมือสำหรับเลือกวันและเวลา --- */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ color: '#e0e0e0', fontWeight: 'bold' }}>Date:</label>
            <input 
              type="date" 
              value={filterDate} 
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#111', color: 'white' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ color: '#e0e0e0', fontWeight: 'bold' }}>Time:</label>
            <select 
              value={filterTime} 
              onChange={(e) => setFilterTime(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#111', color: 'white' }}
            >
              <option value="11:00">11:00 AM - 02:00 PM</option>
              <option value="17:00">05:00 PM - 08:00 PM</option>
            </select>
          </div>

        </div>
        
        <div className="floor-plan-grid">
          {loading ? (
            <div style={{ color: '#aaa', padding: '40px' }}>Loading tables status...</div>
          ) : (
            <div className="table-row">
              {tablesData.map(t => (
                <TableComponent 
                  key={t.id} 
                  name={t.table_name} 
                  seats={t.seats} 
                  shape={t.shape} 
                  status={t.status} //ส่ง status
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}