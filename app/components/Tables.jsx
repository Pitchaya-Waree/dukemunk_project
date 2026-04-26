'use client';
import React, { useState, useEffect } from 'react';
// ⚠️ อย่าลืมแก้ Path ของ supabaseClient ให้ตรงกับโฟลเดอร์ในโปรเจกต์ของคุณ
import { supabase } from '@/supabaseClient'; 
import './Tables.css';

// Component สำหรับสร้างโต๊ะ 1 ตัว
const TableComponent = ({ name, seats, shape, status }) => {
  const shapeClass = shape === 'round' ? 'table-round' : shape === 'vip' ? 'table-vip' : 'table-square';
  // กำหนดสถานะเริ่มต้นเป็น available เพื่อให้โต๊ะแสดงสีเขียว
  const statusClass = `status-${status || 'available'}`;

  return (
    <div className={`table ${shapeClass} ${statusClass}`}>
      <div className="table-name">{name}</div>
      <div className="table-seats">{seats} seats</div>
    </div>
  );
};

// Component หลักสำหรับแสดงแผนผังทั้งหมด
export default function Table() {
  const [tablesData, setTablesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        // ดึงข้อมูลทั้งหมดจากตาราง 'tables'
        const { data, error } = await supabase
          .from('tables')
          .select('*');

        if (error) throw error;

        if (data) {
          // จัดเรียงข้อมูลแบบธรรมชาติ (Natural Sort) เพื่อให้ Table 2 มาก่อน Table 10
          const sortedData = data.sort((a, b) => 
            a.table_name.localeCompare(b.table_name, undefined, { numeric: true })
          );
          setTablesData(sortedData);
        }
      } catch (error) {
        console.error('Error fetching tables:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  return (
    <div className="page-container">
      <div className="right-panel">
        <h2 className="panel-title">Restaurant Floor Plan</h2>
        
        <div className="floor-plan-grid">
          {loading ? (
            <div style={{ color: '#aaa', padding: '40px' }}>Loading tables from database...</div>
          ) : (
            // วนลูปข้อมูลทั้งหมดใน <div className="table-row"> เดียว 
            // ระบบ CSS flex-wrap: wrap ที่มีอยู่แล้วจะช่วยปัดบรรทัดโต๊ะให้สวยงามอัตโนมัติ
            <div className="table-row">
              {tablesData.map(t => (
                <TableComponent 
                  key={t.id} 
                  name={t.table_name} // ใช้ table_name ให้ตรงกับชื่อคอลัมน์ในฐานข้อมูล
                  seats={t.seats} 
                  shape={t.shape} 
                  status="available" // ใส่ default เป็นว่างไปก่อนสำหรับหน้านี้
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}