'use client';
import React, { useState } from 'react';
// ⚠️ อย่าลืมแก้ Path ของ supabaseClient ให้ตรงกับโปรเจกต์คุณ
import { supabase } from '@/supabaseClient'; 
import './ForgotPassword.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        // ส่งคำสั่งรีเซ็ตรหัสผ่านไปยัง Supabase
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            // redirectTo: `${window.location.origin}/pages/reset-password`, 
        });

        if (error) {
            setErrorMsg(error.message);
        } else {
            setSuccessMsg('Password reset link sent! Please check your email inbox.');
            setEmail(''); // เคลียร์ช่องพิมพ์อีเมล
        }
        
        setLoading(false);
    };

    return (
        <div className="forgot-page-container">
            <div className="forgot-overlay">
                
                {/* กล่อง Forgot Password แบบจัดกึ่งกลาง */}
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

                        {/* แสดงข้อความ Error / Success */}
                        {errorMsg && <div className="message-box message-error">{errorMsg}</div>}
                        {successMsg && <div className="message-box message-success">{successMsg}</div>}

                        <button 
                            type="submit" 
                            className="btn-send"
                            disabled={loading || !email}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <div className="back-to-login">
                        {/* เปลี่ยน Path ตรง href ให้ตรงกับหน้า Login ของคุณ */}
                        <a href="/pages/login">← BACK TO LOGIN</a>
                    </div>
                </div>

            </div>
        </div>
    );
}