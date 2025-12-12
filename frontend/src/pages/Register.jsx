import { useState } from "react";
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
    const [initializedPhone, setInitializedPhone] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Validation errors
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");

    // Loading states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [checkingPhone, setCheckingPhone] = useState(false);

    // Server messages
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    let emailTimeout;
    let phoneTimeout;

    /** LIVE EMAIL VALIDATION */
    const validateEmail = (value) => {
        setEmailError("");
        if (!value) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(value);
        if (!isValid) return;

        setCheckingEmail(true);

        clearTimeout(emailTimeout);
        emailTimeout = setTimeout(async () => {
            try {
                const res = await api.post("accounts/validate/email/", { value });
                if (res.data.exists) setEmailError("Email already in use.");
            } catch (err) {
                setEmailError("Could not validate email.");
            } finally {
                setCheckingEmail(false);
            }
        }, 400);
    };

    /** LIVE PHONE VALIDATION */
    const validatePhone = (value) => {
        setPhoneError("");
        if (!value) return;

        setCheckingPhone(true);

        clearTimeout(phoneTimeout);
        phoneTimeout = setTimeout(async () => {
            try {
                const res = await api.post("accounts/validate/phone/", { value });
                if (res.data.exists) setPhoneError("Phone already in use.");
            } catch {
                setPhoneError("Error validating phone.");
            } finally {
                setCheckingPhone(false);
            }
        }, 1000);
    };

    /** SUBMIT FORM */
    const handleSubmit = async (e) => {
        e.preventDefault();

        setServerError("");
        setSuccessMessage("");

        if (password !== confirmPassword) {
            setServerError("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await api.post("accounts/register/", {
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
                password,
                password2: confirmPassword, // REQUIRED for Django
            });

            setSuccessMessage("Account created successfully!");

            const Loginres = await api.post('accounts/token/create', {email, password})
            
            localStorage.setItem(ACCESS_TOKEN, Loginres.data.access)
            localStorage.setItem(REFRESH_TOKEN, Loginres.data.refresh)
            navigate("/")

            
        } catch (error) {
            if (error.response?.data) {
                const err = error.response.data;
                
                if (err.email) setEmailError(err.email[0]);
                if (err.phone) setPhoneError(err.phone[0]);

                if (err.password) setServerError(err.password[0]);
                else if (err.password2) setServerError(err.password2[0]);
                else if (err.detail) setServerError(err.detail);
                else alert(error)
            } else {
                alert(error)
            }
        }

        setIsSubmitting(false);
    };

    return (
        <div className="form-container">
            <h2>SIGN UP</h2>

            <form onSubmit={handleSubmit}>
                
                {/* FIRST NAME */}
                <div className="form-block">
                    <label>First Name</label>
                    <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                {/* LAST NAME */}
                <div className="form-block">
                    <label>Last Name</label>
                    <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                {/* EMAIL */}
                <div className="form-block">
                    <label>Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        className={emailError ? "error" : ""}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            validateEmail(e.target.value);
                        }}
                    />
                    {emailError && <small className="error-message">{emailError}</small>}
                </div>

                {/* PHONE */}
                <div className="form-block">
                    <label>Phone</label>
                    <PhoneInput
                        country={"za"}
                        value={initializedPhone ? phone : ""}
                        onChange={(value) => {
                            setInitializedPhone(true);
                            setPhone("+" + value.replace(/\D/g, ""));
                        }}
                        inputClass={phoneError ? "error" : ""}
                        specialLabel=""
                        enableAreaCodes={true}
                        placeholder="optional..."
                    />
                    {phoneError && <small className="error-message">{phoneError}</small>}
                </div>

                {/* PASSWORD */}
                <div className="form-block">
                    <label>Password</label>
                    <input
                        type="password"
                        required
                        autoComplete="off"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="form-block">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {/* SUBMIT */}
                <div className="form-block submit-block">
                    <button
                        type="submit"
                        disabled={
                            isSubmitting ||
                            checkingEmail ||
                            checkingPhone ||
                            emailError ||
                            phoneError
                        }
                    >
                        {isSubmitting ? "Creating..." : "Create Account"}
                    </button>
                </div>

                {/* SERVER FEEDBACK */}
                {serverError && <p className="error">{serverError}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
            </form>
        </div>
    );
}
