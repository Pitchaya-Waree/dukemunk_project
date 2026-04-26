'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabaseClient'; 
import './Forgotpassword.css'; // 

export default function UpdatePassword() {
    const router = useRouter();

    // Form State รวบรวมข้อมูลรหัสผ่านไว้ใน Object เดียว เพื่อง่ายต่อการจัดการและลดจำนวน State
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    // ควบคุมการแสดงรหัสผ่าน (true = โชว์เป็นตัวหนังสือ, false = ซ่อนเป็นจุด)
    const [showPassword, setShowPassword] = useState(false);

    // UI States (ควบคุมการแสดงผลบนหน้าจอ)
    const [loading, setLoading] = useState(false); // สถานะกำลังโหลดตอนกดปุ่ม
    const [errorMsg, setErrorMsg] = useState(null); // เก็บข้อความสีแดงเมื่อเกิดข้อผิดพลาด
    const [successMsg, setSuccessMsg] = useState(null); // เก็บข้อความสีเขียวเมื่ออัปเดตสำเร็จ

    // ฟังก์ชันจัดการเมื่อผู้ใช้พิมพ์ข้อความ (อัปเดต State อัตโนมัติตามชื่อ name ของ input)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ฟังก์ชันหลักเมื่อกดยืนยันการเปลี่ยนรหัสผ่าน
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        // ตรวจสอบฝั่งหน้าเว็บ: เช็คว่ารหัสผ่าน 2 ช่องพิมพ์มาตรงกันหรือไม่
        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMsg("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            //ส่งรหัสผ่านใหม่ไปอัปเดตในระบบ Supabase
            const { error } = await supabase.auth.updateUser({
                password: formData.newPassword
            });

            if (error) throw error; // ถ้าระบบแจ้ง Error (เช่น รหัสผ่านสั้นไป) ให้โยนไปเข้าบล็อก catch

            // กรณีสำเร็จ: แสดงข้อความและเตรียมเปลี่ยนหน้า
            setSuccessMsg('Password updated successfully! Redirecting to login...');
            
            // หน่วงเวลา 2 วินาทีเพื่อให้ผู้ใช้ได้อ่านข้อความสำเร็จก่อนเด้งไปหน้า Login
            setTimeout(() => {
                router.push('/pages/login');
            }, 2000);

        } catch (error) {
            // แสดงข้อผิดพลาดให้ผู้ใช้เห็น
            setErrorMsg(error.message);
        } finally {
            // ปิดสถานะกำลังโหลดเสมอ
            setLoading(false);
        }
    };

    return (
        <div className="forgot-page-container">
            <div className="forgot-overlay">
                
                <div className="forgot-card">
                    <h2 className="forgot-title">Set New Password</h2>
                    <p className="forgot-subtitle">
                        Please enter your new password below.
                    </p>

                    <form onSubmit={handleUpdatePassword}>
                        
                        {/* ช่องกรอกรหัสผ่านใหม่ */}
                        <div className="input-group" style={{ position: 'relative' }}>
                            <label className="input-label">New Password *</label>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="newPassword"
                                className="forgot-input" 
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                minLength="6"
                                required
                            />
                        </div>

                        {/*ช่องยืนยันรหัสผ่านใหม่*/}
                        <div className="input-group" style={{ position: 'relative' }}>
                            <label className="input-label">Confirm New Password *</label>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="confirmPassword"
                                className="forgot-input" 
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                minLength="6"
                                required
                            />
                        </div>

                        {/* ปุ่มเปิด/ปิดตา*/}
                        <div style={{ textAlign: 'right', marginBottom: '20px', marginTop: '-15px' }}>
                            <span 
                                style={{ fontSize: '0.85rem', color: '#888', cursor: 'pointer' }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide password 🫣' : 'Show password 👁️'}
                            </span>
                        </div>

                        {/* กล่องแสดงข้อความ Error / Success*/}
                        {errorMsg && <div className="message-box message-error">{errorMsg}</div>}
                        {successMsg && <div className="message-box message-success">{successMsg}</div>}

                        {/* ปุ่ม Confirm*/}
                        <button 
                            type="submit" 
                            className="btn-send"
                            // ปุ่มจะถูกปิดการทำงานถ้ากำลังโหลด หรือผู้ใช้ยังกรอกรหัสผ่านไม่ครบทั้ง 2 ช่อง
                            disabled={loading || !formData.newPassword || !formData.confirmPassword}
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}