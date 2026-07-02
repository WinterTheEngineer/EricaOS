import '../styles/Form.css'
import { login } from '../utils/authService';
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

import { toast } from 'react-toastify';


function Login() {
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

    return (<>
        <aside>
            <form onSubmit={handleSubmit} className="erica-form" id="login">
                <div className="form-header">
                    <img src={sidebarLogo} alt="Erica Logo" className='logo' />
                    <h1 className='erica-site-heading'>Welcome Back</h1>
                </div>
                <div className="oauth-login">
                    <button className="erica-site-btn google auth">
                        <FcGoogle />
                        Google
                    </button>
                    <button className="erica-site-btn google auth">
                        <FaApple />
                        Apple
                    </button>
                    <button className="erica-site-btn google auth">
                        <MdPermPhoneMsg />
                        Phone
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
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                        />
                    </div>
                    <div className="form-input">
                        <input
                            type={privacy ? 'password' : 'text'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
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
        </aside>
        <div id="login-hero">
            
        </div>
    </>)
}

export default Login;