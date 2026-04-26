'use client';
import React, { useState } from 'react';
import './Login.css';

export default function LoginPage() {
    // State สำหรับเปิด-ปิด รหัสผ่าน
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="login-page-container">
            <div className="login-overlay">

                <div className="login-content-wrapper">

                    <div className="restaurant-info">
                        <h1 className="brand-logo">DUKE MUNK</h1>
                        <p className="brand-sub">ดุกมั้ง</p>

                        <div className="details-text">
                            <p>ดุกมั้ง - DUKE MUNK</p>
                            <p>Tue-Sun : 12:00 - 9:30pm</p>
                            <p>Closed : Mon</p>
                        </div>

                    </div>
                    {/* กล่อง Login */}
                    <div className="login-card">
                        <h2 className="login-title">Login</h2>

                        <form>
                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <div className="input-field-wrapper">
                                    <input
                                        type="email"
                                        className="login-input"
                                        placeholder="Enter your Email"
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Password</label>
                                <div className="input-field-wrapper">
                                    <input
                                        // เปลี่ยน type สลับไปมาระหว่าง password และ text
                                        type={showPassword ? "text" : "password"}
                                        className="login-input"
                                        placeholder="Enter your password"
                                    />
                                    {/* ปุ่มคลิกโชว์รหัสผ่าน */}
                                    <span
                                        className="eye-icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? '🫣' : '👁️'}
                                    </span>
                                </div>
                            </div>

                            <div className="forgot-password">
                                <a href="/pages/forgot-password">FORGOT YOUR PASSWORD?</a>
                            </div>

                            <button type="button" className="btn-login">Login</button>
                        </form>

                        <div className="signup-link">
                            Don't have an account ? <a href="#">Sign up</a>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}