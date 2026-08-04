import '../styles/Form.css'
import Modal from '../components/EricaUI/Modal'
import { login, handleGoogleSuccess } from '../utils/authService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import sidebarLogo from '../assets/sidebar-logo.png';

import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { MdPermPhoneMsg } from "react-icons/md";
import { useGoogleLogin } from "@react-oauth/google";

import { toast } from 'react-toastify';


function Login() {
    const [showSignUpModal, setShowSignUpModal] = useState(false)
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [privacy, setPrivacy] = useState(true)

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "EricaOS - Login";
    }, []);

    

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            await login({ email, password });
            navigate("/dashboard")
        } catch (err) {
            console.error(err);
            toast.error(err.response.data.detail);
        } finally {
            setLoading(false);
        }
    };

    const login_with_google = useGoogleLogin({
        flow: "auth-code",
        redirect_uri: 'http://localhost:5173/login',
        onSuccess: async ({ code }) => {
            try {
                await handleGoogleSuccess({ code });
                navigate("/dashboard");
            } catch (err) {
                if (err.response.status === 404) {
                    setShowSignUpModal(true)
                }
            }
        },
        onError: (err) => {
            toast.error("Google Sign In Failed");
        },
    });

    return (<>
        <>
            <form onSubmit={handleSubmit} className="erica-form" id="login">
                <div className="form-header">
                    <img src={sidebarLogo} alt="Erica Logo" className='logo' />
                    <h1 className='erica-site-heading'>Welcome Back</h1>
                </div>
                <div className="oauth-login">
                    <button
                        type='button'
                        className="erica-site-btn"
                        onClick={login_with_google}
                    >
                        <FcGoogle /> Sign in with google
                    </button>
                </div>
                <p className="separator site-p">
                    or
                </p>
                <div className="manual-login">
                    <div className="form-input">
                        <input
                            type="email"
                            value={email}
                            className='erica-input-field'
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                        />
                    </div>
                    <div className="form-input">
                        <input
                            type={privacy ? 'password' : 'text'}
                            value={password}
                            required
                            className='erica-input-field'
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        <div
                            onClick={() => {setPrivacy(prev => !prev)}}
                            className={`toggle-privacy ${privacy ? '' : 'toggled'}`}>
                            {privacy ? <LuEyeOff /> : <LuEye />}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="erica-site-btn primary submit"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </div>
            </form>
            <Link to={'/sign-up'} className='erica-site-link'>
                Don't have an account? <span>Sign Up</span>
            </Link>
            {showSignUpModal && (
                <Modal 
                    modalId={'signup-redirect'}
                    onClose={() => setShowSignUpModal(false)}

                    body={
                        <>
                            <svg className='modal-icon' viewBox="0 0 500 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="136" cy="125" r="67.5" stroke="black" stroke-width="15"/>
                                <circle cx="365" cy="125" r="67.5" stroke="black" stroke-width="15"/>
                                <line x1="210" y1="125" x2="291" y2="125" stroke="black" stroke-width="14"/>
                                <path d="M392.625 153.625L364.5 125.5M364.5 125.5L336.375 97.375M364.5 125.5L392.625 97.375M364.5 125.5L336.375 153.625" stroke="black" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M172.771 117.656H169.75V117.5H136V132.5H157.193C154.101 141.232 145.793 147.5 136 147.5C123.574 147.5 113.5 137.426 113.5 125C113.5 112.574 123.574 102.5 136 102.5C141.736 102.5 146.954 104.664 150.927 108.198L161.534 97.5912C154.836 91.3494 145.877 87.5 136 87.5C115.291 87.5 98.5 104.291 98.5 125C98.5 145.709 115.291 162.5 136 162.5C156.709 162.5 173.5 145.709 173.5 125C173.5 122.486 173.241 120.031 172.771 117.656Z" fill="#FFC107"/>
                                <path d="M102.824 107.546L115.144 116.581C118.478 108.327 126.552 102.5 136 102.5C141.736 102.5 146.954 104.664 150.927 108.198L161.534 97.5912C154.836 91.3494 145.877 87.5 136 87.5C121.596 87.5 109.105 95.6319 102.824 107.546Z" fill="#FF3D00"/>
                                <path d="M136 162.5C145.686 162.5 154.487 158.793 161.142 152.765L149.536 142.944C145.771 145.796 141.091 147.5 136 147.5C126.246 147.5 117.964 141.281 114.844 132.601L102.616 142.023C108.822 154.168 121.426 162.5 136 162.5Z" fill="#4CAF50"/>
                                <path d="M172.771 117.656H169.75V117.5H136V132.5H157.193C155.708 136.694 153.01 140.311 149.53 142.946L149.536 142.942L161.142 152.763C160.321 153.509 173.5 143.75 173.5 125C173.5 122.486 173.241 120.031 172.771 117.656Z" fill="#1976D2"/>
                            </svg>

                            <h2 className='erica-site-heading'>
                                This Google Account is not linked
                                to any EricaOS accounts.
                            </h2>
                            <p>
                                Would you like to create an account instead?
                            </p>
                        </>
                    }

                    footer={
                        <>
                            <Link to="/sign-up" href="http://" className='erica-site-btn primary'>Sign Up</Link>   
                            <button className='erica-site-btn secondary' onClick={() => setShowSignUpModal(false)}>No, Thanks</button>
                        </>
                    }
                />
            )}
        </>
    </>)
}

export default Login;