import '../styles/Nav.css';
import { useState, useEffect } from "react";
import logo from '../assets/sidebar-logo.png';
import { RiMenu3Fill } from "react-icons/ri";

import { Link } from 'react-router-dom';

function Nav () {

    const toggleMobileMenu = () => {
        const mobileMenu = document.getElementById('nav');
        const subMenu = document.querySelector('.nav-list.mobile')
        
        mobileMenu.classList.toggle('active');

        if (!subMenu.classList.contains('active')) {
            setTimeout(() => {
                subMenu.classList.toggle('active');
            }, 600)
        } else {
            subMenu.classList.toggle('active');
        }


    }

    return (
        <nav id='nav'>
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
            <ul className="nav-list mobile">
                <li>Home</li>
                <li>Features</li>
                <li>Pricing</li>
                <li>Developers</li>
                <li>Contact</li>
            </ul>
        </nav>
    )
}

export default Nav