'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabaseClient';
import './Signup.css';

export default function Signup() {
    const router = useRouter();

    // States สำหรับเก็บค่าฟอร์ม
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // States สำหรับสถานะระบบ
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        // ตัดตัวอักษรที่ไม่ใช่ตัวเลขออก เพื่อให้สอดคล้องกับ DataType int8 ในฐานข้อมูล
        const formattedPhone = phone.replace(/\D/g, '');

        // ส่งข้อมูลสมัครสมาชิกไปยัง Supabase
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    firstname: firstName,       // ส่ง firstname แยก
                    lastname: lastName,         // ส่ง lastname แยก
                    phone_number: formattedPhone // ส่งเบอร์โทรที่เป็นตัวเลขล้วน
                }
            }
        });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        } else {
            // เปลี่ยนข้อความแจ้งเตือนเล็กน้อยให้รู้ว่าจะเปลี่ยนหน้า
            setSuccessMsg('Registration successful! Redirecting to login page...');
            setLoading(false);

            // เปลี่ยนไปหน้า Login 
            setTimeout(() => {
                router.push('/pages/login');
            }, 2000);
        }
    };

    return (
        <div className="signup-page-container">
            <div className="signup-overlay">
                <div className="signup-content-wrapper">

                    {/* ข้อมูลร้าน (ฝั่งซ้าย) */}
                    <div className="restaurant-info">
                        <a href="/" className="brand-logo">DUKE MUNK</a>
                        <p className="brand-sub">ดุกมั้ง</p>
                        <div className="details-text">
                            <p>ดุกมั้ง - DUKE MUNK</p>
                            <p>Lorem ipsum - Dolor sit | 00:00 A.M. - 00:00 P.M.</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>

                    {/* กล่อง Register (ฝั่งขวา) */}
                    <div className="register-card">
                        <h2 className="register-title">Register</h2>

                        <form onSubmit={handleSignup}>

                            {/* แถวที่ 1: ชื่อ - นามสกุล */}
                            <div className="form-grid">
                                <div className="input-group">
                                    <label className="input-label">First Name *</label>
                                    <input
                                        type="text"
                                        className="register-input"
                                        placeholder="Enter your First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Last Name *</label>
                                    <input
                                        type="text"
                                        className="register-input"
                                        placeholder="Enter your Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
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
                                        className="register-input"
                                        placeholder="Enter your Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Phone Number *</label>
                                    <div className="phone-input-container">
                                        <div className="country-code">+66</div>
                                        <input
                                            type="tel"
                                            className="phone-input"
                                            placeholder="Your Phone Number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
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
                                        className="register-input"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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

                            {/* แสดงข้อความ Error / Success */}
                            {errorMsg && <div className="message-box message-error">{errorMsg}</div>}
                            {successMsg && <div className="message-box message-success">{successMsg}</div>}

                            {/* Login   */}
                            <div className="Login">
                                <a href="/pages/login">Already have an account? Login here</a>
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