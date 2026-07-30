import '../styles/Nav.css';
import { useState, useEffect, useRef } from "react";
import logo from '../assets/sidebar-logo.png';
import { RiMenu3Fill } from "react-icons/ri";

import { Link } from 'react-router-dom';

function Nav () {

    const navRef = useRef()
    const mobileNav = useRef()

    const toggleMobileMenu = () => {
        const subMenu = document.querySelector('.nav-list.mobile')
        
        
        navRef.current.classList.toggle('active');

        if (!mobileNav.current.classList.contains('active')) {
            setTimeout(() => {
                mobileNav.current.classList.toggle('active');
            }, 600)
        } else {
            mobileNav.current.classList.toggle('active');
        }


    }

    return (
        <nav id='nav' ref={navRef}>
            <div className="nav-container">
                <img className="logo" src={logo} alt="The official logo for EricaOS" />
                <ul className="nav-list desktop">
                    <li>Home</li>
                    <li>Features</li>
                    <li>Pricing</li>
                    <li>Developers</li>
                    <li>Contact</li>
                </ul>
                <div className="nav-actions">
                    <Link to="/login" href="http://" className='erica-site-btn primary'>Sign in</Link>
                    <Link to="/sign-up" href="http://" className='erica-site-btn secondary'>Sign Up</Link>
                </div>
                <button
                    id='nav-toggle'
                    className='mobile'
                    onClick={toggleMobileMenu}
                >
                    <RiMenu3Fill />
                </button>
            </div>
            <div className="nav-container mobile" ref={mobileNav}>
                <ul className="nav-list">
                    <li>
                        <Link className='erica-site-link' to={'/'}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link className='erica-site-link' to={'/'}>
                            Features
                        </Link>
                    </li>
                    <li>
                        <Link className='erica-site-link' to={'/'}>
                            Contact
                        </Link>
                    </li>
                </ul>
                <div className="nav-actions">
                    <Link to="/login" href="http://" className='erica-site-btn primary'>Sign in</Link>
                    <Link to="/sign-up" href="http://" className='erica-site-btn secondary'>Sign Up</Link>
                </div>
            </div>
        </nav>
    )
}

export default Nav