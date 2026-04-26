'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient';
import './Login.css';

export default function LoginPage() {
    const router = useRouter();

    // State สำหรับเปิด-ปิด รหัสผ่าน
    const [showPassword, setShowPassword] = useState(false);
    
    // State สำหรับเก็บค่าฟอร์ม
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // State สำหรับจัดการสถานะการโหลดและข้อความแจ้งเตือน
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    // ฟังก์ชันจัดการตอนกดปุ่ม Login
    const handleLogin = async (e) => {
        e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรชตอนกด Submit
        setLoading(true);
        setErrorMsg(null);

        // เรียกใช้ฟังก์ชัน Login ของ Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            // ถ้าอีเมลหรือรหัสผ่านผิด ให้แสดงข้อความแจ้งเตือน
            setErrorMsg(error.message);
            setLoading(false);
        } else {
            // ถ้าระบบเช็คแล้วผ่าน (Login สำเร็จ)
            console.log('Login successful:', data.user);
            
            // เปลี่ยนหน้าไปยังหน้าหลัก หรือหน้าจองโต๊ะ (ปรับแก้ Path ได้ตามต้องการ)
            router.push('/'); 
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-overlay">
                <div className="login-content-wrapper">

                    <div className="restaurant-info">
                        <h1 className="brand-logo">DUKE MUNK</h1>
                        <p className="brand-sub">ดุกมั้ง</p>

                        <div className="details-text">
                            <p>ดุกมั้ง - DUKE MUNK</p>
                            <p>Lorem ipsum - Dolor sit | 00:00 A.M. - 00:00 P.M.</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>

                    {/* login form */}
                    <div className="login-card">
                        <h2 className="login-title">Login</h2>

                        {/* เปลี่ยนเป็น <form onSubmit={handleLogin}> เพื่อให้กด Enter เพื่อล็อกอินได้ */}
                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <div className="input-field-wrapper">
                                    <input
                                        type="email"
                                        className="login-input"
                                        placeholder="Enter your Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Password</label>
                                <div className="input-field-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="login-input"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <span
                                        className="eye-icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? '🫣' : '👁️'}
                                    </span>
                                </div>
                            </div>

                            {/* error catch */}
                            {errorMsg && (
                                <div style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>
                                    {errorMsg === 'Invalid login credentials' ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : errorMsg}
                                </div>
                            )}

                            <div className="forgot-password">
                                <a href="/pages/forgotPassword">FORGOT YOUR PASSWORD?</a>
                            </div>

                            <button 
                                type="submit" 
                                className="btn-login"
                                disabled={loading}
                                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <div className="signup-link">
                            Don't have an account ?<a href="/pages/signup"> Sign up</a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}