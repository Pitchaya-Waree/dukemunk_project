'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// ⚠️ อย่าลืมแก้ Path ของ supabaseClient ให้ตรงกับโปรเจกต์คุณ
import { supabase } from '@/supabaseClient'; 
import './Signup.css';

export default function SignupPage() {
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

        // รวมชื่อและนามสกุลเป็น full_name
        const fullName = `${firstName} ${lastName}`.trim();

        // ส่งข้อมูลสมัครสมาชิกไปยัง Supabase
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,       // ส่ง full_name ไปเพื่อให้ Trigger เอาไปลงตาราง profiles
                    phone_number: phone,       // ส่งเบอร์โทรไปเก็บไว้ใน meta_data (เผื่อใช้งาน)
                }
            }
        });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        } else {
            // สมัครสำเร็จ
            setSuccessMsg('Registration successful! Please check your email to verify your account.');
            setLoading(false);
            
            // กรณีที่ตั้งค่า Supabase ให้ไม่ต้องกดยืนยันอีเมล สามารถสั่งเปลี่ยนหน้าได้เลย
            // setTimeout(() => router.push('/pages/login'), 2000); 
        }
    };

    return (
        <div className="signup-page-container">
            <div className="signup-overlay">
                <div className="signup-content-wrapper">

                    {/* ข้อมูลร้าน (ฝั่งซ้าย) */}
                    <div className="restaurant-info">
                        <h1 className="brand-logo">DUKE MUNK</h1>
                        <p className="brand-sub">ดุกมั้ง</p>
                        <div className="details-text">
                            <p>ดุกมั้ง - DUKE MUNK</p>
                            <p>Tue-Sun : 12:00 - 9:30pm</p>
                            <p>Closed : Mon</p>
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
                                        {/* จำลองธงและรหัสประเทศ */}
                                        <div className="country-code">🇹🇭 +66</div>
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

                            {/* แถวที่ 3: รหัสผ่าน (กินพื้นที่เต็มบรรทัด) */}
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
                                        minLength="6" // Supabase บังคับขั้นต่ำ 6 ตัวอักษร
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