import '../styles/form.css'
import { Link } from 'react-router-dom';
import { register } from '../utils/authService';
import { useEffect, useState } from 'react';
import { debounce, validateField } from '../utils/validators';
import sidebarLogo from '../assets/sidebar-logo.png';

import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";

import PhoneInput from "react-phone-input-2";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export default function Register() {
    // Form fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // Validation errors
    const [privacy, setPrivacy] = useState(true)
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    // Loading states
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [checkingPhone, setCheckingPhone] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    const [messages, setMessages] = useState([]);

    const navigate = useNavigate();


    /** LIVE EMAIL VALIDATION */
    const validateEmail = debounce(async (value) => {
        if (!value) {
            setEmailError("");
            setCheckingEmail(false);
            return;
        }

        setCheckingEmail(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            setEmailError("Invalid email format");
            setCheckingEmail(false);
            return;
        }

        try {
            const exists = await validateField(
                "/accounts/validate/email/",
                value
            );

            if (exists) {
                setEmailError("Email already in use.");
            } else {
                setEmailError("");
            }

        } catch {
            setEmailError("Could not validate email.");
        } finally {
            setCheckingEmail(false);
        }
    }, 400);

    /** LIVE PHONE VALIDATION */
    const validatePhone = debounce(async (value) => {
        if (!value) {
            setPhoneError("");
            setCheckingPhone(false);
            return;
        }

        if (value.length < 10) {
            setPhoneError("");
            setCheckingPhone(false);
            return;
        }

        setCheckingPhone(true);

        try {
            const exists = await validateField(
                "/accounts/validate/phone/",
                value
            );

            if (exists) {
                setPhoneError("This phone number is already in use.");
            } else {
                setPhoneError("");
            }

        } catch {
            setPhoneError("Could not validate phone.");
        } finally {
            setCheckingPhone(false);
        }
    }, 400);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await register({
                firstName,
                lastName,
                email,
                phone,
                password,
                confirmPassword
            });

            setMessages("Account created successfully! Signing in...");

            await login({
                identifier: email,
                password
            });

            navigate("/dashboard");

        } catch (error) {
            const err = error.response?.data;

            if (err?.email) setEmailError(err.email[0]);
            if (err?.phone) setPhoneError(err.phone[0]);

            setFieldErrors(prev => ({
                ...prev,
                password: err?.password?.[0],
                password2: err?.password2?.[0],
                detail: err?.detail
            }));

            if (!err) alert(error);

        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="erica-form" id="register">

                <div className="form-header">
                    <img src={sidebarLogo} alt="Erica Logo" className="logo" />
                    <h1 className="erica-site-heading">Create Account</h1>
                </div>

                <div className="form-block">

                    <div className="form-input">
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="first name"
                        />
                    </div>

                    <div className="form-input">
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="last name"
                        />
                    </div>

                    <div className="form-input">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                validateEmail(e.target.value);
                            }}
                            placeholder="email address"
                        />

                        {emailError && (
                            <small className="field-error">
                                {emailError}
                            </small>
                        )}
                    </div>

                    <div className="form-input">
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                validatePhone(e.target.value);
                            }}
                            placeholder="phone number (optional)"
                        />

                        {phoneError && (
                            <small className="field-error">
                                {phoneError}
                            </small>
                        )}
                    </div>

                    <div className="form-input">
                        <input
                            type={privacy ? "password" : "text"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                        />

                        <button
                            type="button"
                            onClick={() => setPrivacy(prev => !prev)}
                            className={`toggle-privacy ${privacy ? "" : "toggled"}`}
                        >
                            {privacy ? <LuEyeOff /> : <LuEye />}
                        </button>
                    </div>

                    <div className="form-input">
                        <input
                            type={privacy ? "password" : "text"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="confirm password"
                        />

                        <button
                            type="button"
                            onClick={() => setPrivacy(prev => !prev)}
                            className={`toggle-privacy ${privacy ? "" : "toggled"}`}
                        >
                            {privacy ? <LuEyeOff /> : <LuEye />}
                        </button>
                    </div>
                </div>

                {fieldErrors?.detail && (
                    <small className="field-error">
                        {fieldErrors.detail}
                    </small>
                )}

                <button
                    type="submit"
                    disabled={submitting || checkingEmail || checkingPhone}
                    className="erica-site-btn primary submit"
                >
                    {submitting ? "Creating Account..." : "Create Account"}
                </button>

            </form>
            <Link to={'/login'} className='erica-site-link'>
                Already have an account? <span>Sign In</span>
            </Link>
        </>
    );
}
