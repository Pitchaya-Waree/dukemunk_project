'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/supabaseClient';
import './Signup.css';

export default function Signup() {
    const router = useRouter();

    // รวบรวมข้อมูลฟอร์มไว้ใน Object เดียว เพื่อง่ายต่อการจัดการและลดจำนวน State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });

    // State ควบคุมการแสดงรหัสผ่าน (true = โชว์เป็นตัวหนังสือ, false = ซ่อนเป็นจุด)
    const [showPassword, setShowPassword] = useState(false);

    // State UI States
    const [loading, setLoading] = useState(false); // สถานะกำลังโหลดตอนกดปุ่ม
    const [errorMsg, setErrorMsg] = useState(null); // เก็บข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด
    const [successMsg, setSuccessMsg] = useState(null); // เก็บข้อความเมื่อสมัครสำเร็จ

    // ฟังก์ชันจัดการเมื่อผู้ใช้พิมพ์ข้อความ 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ฟังก์ชันหลักเมื่อกดปุ่ม Confirm สมัครสมาชิก
    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        // ตัดตัวอักษรที่ไม่ใช่ตัวเลขออกให้เหลือแต่ตัวเลขล้วน
        const formattedPhone = formData.phone.replace(/\D/g, '');

        try {
            // ส่งข้อมูลไปยัง Supabase
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        firstname: formData.firstName,
                        lastname: formData.lastName,
                        phone_number: formattedPhone 
                    }
                }
            });

            if (error) throw error; // ถ้ามี Error โยนไปเข้าบล็อก catch ด้านล่าง

            // หากสำเร็จ
            setSuccessMsg('Registration successful! Redirecting to login page...');
            
            // หน่วงเวลา 2 วินาทีแล้วเด้งไปหน้า Login
            setTimeout(() => {
                router.push('/pages/login');
            }, 2000);

        } catch (error) {
            setErrorMsg(error.message); // แสดงข้อความ Error ให้ผู้ใช้เห็น
        } finally {
            setLoading(false); // ปิดสถานะโหลดเสมอ (ไม่ว่าจะสำเร็จหรือล้มเหลว)
        }
    };

    // 3. RENDER UI (การวาดหน้าจอ)
    return (
        <div className="signup-page-container">
            <div className="signup-overlay">
                <div className="signup-content-wrapper">

                    {/* --- ข้อมูลร้าน (ฝั่งซ้าย) --- */}
                    <div className="restaurant-info">
                        <Link href="/" className="brand-logo">DUKE MUNK</Link>
                        <p className="brand-sub">ดุกมั้ง</p>
                        <div className="details-text">
                            <p>ดุกมั้ง - DUKE MUNK</p>
                            <p>Lorem ipsum - Dolor sit | 00:00 A.M. - 00:00 P.M.</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>

                    {/* --- กล่อง Register (ฝั่งขวา) --- */}
                    <div className="register-card">
                        <h2 className="register-title">Register</h2>

                        <form onSubmit={handleSignup}>

                            {/* แถวที่ 1: ชื่อ - นามสกุล */}
                            <div className="form-grid">
                                <div className="input-group">
                                    <label className="input-label">First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName" // ต้องตั้งชื่อให้ตรงกับ Key ใน formData
                                        className="register-input"
                                        placeholder="Enter your First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className="register-input"
                                        placeholder="Enter your Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* แถวที่ 2: อีเมล - เบอร์โทร */}
                            <div className="form-grid">
                                <div className="input-group">
                                    <label className="input-label">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="register-input"
                                        placeholder="Enter your Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Phone Number *</label>
                                    <div className="phone-input-container">
                                        <div className="country-code">+66</div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="phone-input"
                                            placeholder="Your Phone Number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* แถวที่ 3: รหัสผ่าน */}
                            <div className="input-group" style={{ marginBottom: '20px' }}>
                                <label className="input-label">Password (Login Password) *</label>
                                <div className="input-field-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="register-input"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength="6"
                                    />
                                    <span
                                        className="eye-icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? '🫣' : '👁️'}
                                    </span>
                                </div>
                            </div>

                            {/* กล่องแสดงข้อความ Error / Success */}
                            {errorMsg && <div className="message-box message-error">{errorMsg}</div>}
                            {successMsg && <div className="message-box message-success">{successMsg}</div>}

                            {/* ลิงก์ไปหน้า Login */}
                            <div className="Login">
                                <Link href="/pages/login">Already have an account? Login here</Link>
                            </div>

                            {/* ปุ่ม Confirm */}
                            <div className="btn-wrapper">
                                <button
                                    type="submit"
                                    className="btn-confirm"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}