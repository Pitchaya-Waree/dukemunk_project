'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/supabaseClient';
import './Forgotpassword.css';

export default function ForgotPassword() {
    // Form State
    const [email, setEmail] = useState(''); // เก็บค่าอีเมลที่ผู้ใช้พิมพ์ลงในช่อง

    // UI States 
    const [loading, setLoading] = useState(false); // ควบคุมปุ่มกด (true = ปิดปุ่มและขึ้นว่า Sending...)
    const [errorMsg, setErrorMsg] = useState(null); // เก็บข้อความสีแดงเมื่อเกิดข้อผิดพลาด
    const [successMsg, setSuccessMsg] = useState(null); // เก็บข้อความสีเขียวเมื่อส่งอีเมลสำเร็จ

    // ฟังก์ชันสำหรับส่งคำสั่ง Reset Password ไปยัง Supabase
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            // ส่งคำสั่งรีเซ็ตรหัสผ่านพร้อมแนบอีเมล
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/pages/updatepassword`, // หลังจากคลิกลิงก์ในอีเมลแล้วจะพาไปที่หน้า Update Password
            });

            if (error) throw error; // ถ้าระบบ Supabase แจ้ง Error ให้โยนไปเข้าบล็อก catch

            // กรณีสำเร็จ
            setSuccessMsg('Password reset link sent! Please check your email inbox.');
            setEmail(''); // เคลียร์ช่องพิมพ์อีเมลให้ว่าง

        } catch (error) {
            // กรณีล้มเหลว (เช่น Rate limit, อีเมลผิดรูปแบบ)
            setErrorMsg(error.message);
        } finally {
            // ปิดสถานะกำลังโหลดเสมอ เพื่อให้ปุ่มกลับมาคลิกได้อีกครั้ง
            setLoading(false);
        }
    };

    // RENDER UI (การวาดหน้าจอ)
    return (
        <div className="forgot-page-container">
            <div className="forgot-overlay">

                {/*Forgot Password*/}
                <div className="forgot-card">
                    <h2 className="forgot-title">Forgot Password?</h2>
                    <p className="forgot-subtitle">
                        Enter the email address associated with your account and we'll send you a link to reset your password.
                    </p>

                    <form onSubmit={handleResetPassword}>
                        <div className="input-group">
                            <label className="input-label">Email Address *</label>
                            <input
                                type="email"
                                className="forgot-input"
                                placeholder="Enter your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* กล่องแสดงข้อความ Error / Success */}
                        {errorMsg && <div className="message-box message-error">{errorMsg}</div>}
                        {successMsg && <div className="message-box message-success">{successMsg}</div>}

                        <button
                            type="submit"
                            className="btn-send"
                            disabled={loading || !email} // ปิดปุ่มถ้ากำลังโหลดอยู่ หรือยังไม่ได้พิมพ์อีเมล
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <div className="back-to-login">
                        <Link href="/pages/login">← BACK TO LOGIN</Link>
                    </div>
                </div>

            </div>
        </div>
    );
}