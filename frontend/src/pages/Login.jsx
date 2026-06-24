import '../styles/Form.css'
import { login } from '../utils/authService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import sidebarLogo from '../assets/sidebar-logo.png';

import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

import { toast } from 'react-toastify';


function Login() {
    const [loading, setLoading] = useState(false);
    const [identifier, setIdentifier] = useState("");
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
            await login({ identifier, password });
            navigate("/dashboard")
        } catch (err) {
            console.error(err);
            toast.error(err.response.data.detail);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="erica-form" id="login">
                <div className="form-header">
                    <img src={sidebarLogo} alt="Erica Logo" className='logo' />
                    <h1 className='erica-site-heading'>Welcome Back</h1>
                </div>

                <div className="form-input">
                    <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="email or phone number"
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
            </form>
            <Link to={'/sign-up'} className='erica-site-link'>
                Don't have an account? <span>Sign Up</span>
            </Link>
        </>
    )
}

export default Login;