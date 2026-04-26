import React from 'react';
import './Tables.css';

// Component สำหรับสร้างโต๊ะ 1 ตัว
const TableComponent = ({ name, seats, shape, status }) => {
  const shapeClass = shape === 'round' ? 'table-round' : shape === 'vip' ? 'table-vip' : 'table-square';
  const statusClass = `status-${status}`;

  return (
    <div className={`table ${shapeClass} ${statusClass}`}>
      <div className="table-name">{name}</div>
      <div className="table-seats">{seats} seats</div>
    </div>
  );
};

// Component หลักสำหรับแสดงแผนผังทั้งหมด
export default function Table() {
  const row1 = [
    { id: 1, name: 'Table 1', seats: 2, shape: 'round', status: 'available' },
    { id: 2, name: 'Table 2', seats: 2, shape: 'round', status: 'occupied' },
    { id: 3, name: 'Table 3', seats: 2, shape: 'round', status: 'available' },
    { id: 4, name: 'Table 4', seats: 2, shape: 'round', status: 'reserved' },
    { id: 5, name: 'Table 5', seats: 2, shape: 'round', status: 'available' },
  ];
  
  const row2 = [
    { id: 6, name: 'Table 6', seats: 4, shape: 'square', status: 'available' },
    { id: 7, name: 'Table 7', seats: 4, shape: 'square', status: 'available' },
    { id: 8, name: 'Table 8', seats: 4, shape: 'square', status: 'reserved' },
    { id: 9, name: 'Table 9', seats: 4, shape: 'square', status: 'available' },
  ];

  const row3 = [
    { id: 10, name: 'Table 10', seats: 4, shape: 'square', status: 'available' },
    { id: 11, name: 'Table 11', seats: 4, shape: 'square', status: 'available' },
    { id: 12, name: 'Table 12', seats: 4, shape: 'square', status: 'occupied' },
    { id: 13, name: 'Table 13', seats: 4, shape: 'square', status: 'available' },
  ];

  const row4 = [
    { id: 14, name: 'VIP 1', seats: 6, shape: 'vip', status: 'available' },
    { id: 15, name: 'VIP 2', seats: 6, shape: 'vip', status: 'available' },
    { id: 16, name: 'VIP 3', seats: 8, shape: 'vip', status: 'reserved' },
  ];

  return (
    // เพิ่ม div คลุมด้านนอกสุดเพื่อจัดกึ่งกลางเต็มหน้าจอ
    <div className="page-container">
      <div className="right-panel">
        <h2 className="panel-title">Restaurant Floor Plan</h2>
        
        <div className="floor-plan-grid">
          <div className="table-row">
            {row1.map(t => <TableComponent key={t.id} {...t} />)}
          </div>
          <div className="table-row">
            {row2.map(t => <TableComponent key={t.id} {...t} />)}
          </div>
          <div className="table-row">
            {row3.map(t => <TableComponent key={t.id} {...t} />)}
          </div>
          <div className="table-row">
            {row4.map(t => <TableComponent key={t.id} {...t} />)}
          </div>
        </div>
      </div>
    </div>
  );
}