import api from '../api';
import '../styles/Sidebar.css'
import Searchbar from './Searchbar';
import { logout } from '../utils/authService';
import sidebarLogo from '../assets/sidebar-logo.png';
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { RxExit } from "react-icons/rx";
import { BiNote, BiMenuAltRight } from "react-icons/bi";
import { FaRegDotCircle } from "react-icons/fa";
import { useEffect, useRef, useState } from 'react';
import { PiUserFill } from "react-icons/pi";
import { MdDashboard } from "react-icons/md";
import { FaNoteSticky } from "react-icons/fa6";
import { CiBoxList } from "react-icons/ci";

function Sidebar ({profile}) {

    const username = profile.short_name
    const avatar = profile.avatar
    
    const sidebarRef = useRef()

    const navigate = useNavigate()
    const [loggingOut, setLoggingOut] = useState(false)
    const [sidebarExpanded, setSidebarExpanded] = useState(false)
    const [sidebarDropped, setSidebarDropped] = useState(false)

    const handleLogout = () => {
        setLoggingOut(true);
        logout();
        setTimeout(() => {
            navigate('/')
        }, 2000)
    }

    const sidebarOnClose = () => {
        setSidebarDropped(prev => !prev)
    }

    return (<>
        <aside id="sidebar" ref={sidebarRef} className={`${sidebarDropped ? "dropped" : ""} ${sidebarExpanded ? "expanded" : ''}`}>
            <div className="sidebar-container">

                <div className="sidebar-header">
                    <Link to={'/'} className='sidebar-logo'>
                        <img src={sidebarLogo} alt="The Official EricaOS Logo" />
                    </Link>
                    <button
                        type="submit"
                        onClick={() => setSidebarDropped(prev => !prev)}
                        className="erica-site-btn menu-toggle drop"
                    >
                        <BiMenuAltRight />
                    </button>
                    <button
                        type="submit"
                        onClick={() => setSidebarExpanded(prev => !prev)}
                        className="erica-site-btn menu-toggle expand"
                    >
                        <BiMenuAltRight />
                    </button>
                </div>
                <div className="sidebar-main">
                    <Searchbar />
                    <ul className='sidebar-list'>
                        <li>
                            <Link
                                onClick={sidebarOnClose}
                                to="/dashboard">
                                <MdDashboard className='link-icon' />
                                Dashboard
                            </Link>
                        </li>
                        {/* <li>
                            <Link
                                onClick={sidebarOnClose}
                                to="/dashboard/notes">
                                <FaNoteSticky className='link-icon' />
                                Notes
                            </Link>
                        </li> */}
                        <li>
                            <Link
                                onClick={sidebarOnClose}
                                to="/dashboard/lists">
                                <CiBoxList className='link-icon' />
                                Lists
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="sidebar-footer">
                    <button className="erica-site-btn user-toggle">
                        <span className="user-icon">
                            {avatar ? 
                                <img src={avatar} alt="" /> : <PiUserFill />}
                        </span>
                        {username ? username : "Anonymous"}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="erica-site-btn user-logout"
                    >
                        {loggingOut ? "Logging Out..." : <RxExit />}
                    </button>
                </div>
            </div>
        </aside>
    </>)
}

export default Sidebar