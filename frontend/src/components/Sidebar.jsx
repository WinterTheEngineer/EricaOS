import '../styles/globals.css'
import Searchbar from './Searchbar';
import sidebarLogo from '../assets/sidebar-logo.png';
import { Link, NavLink } from 'react-router-dom'

import { BiNote } from "react-icons/bi";
import { FaRegDotCircle } from "react-icons/fa";

function Sidebar () {

    return (<>
        <aside id="sidebar">
            <Link to={'/'}>
                <img src={sidebarLogo} className='logo' alt="The Official EricaOS Logo" />
            </Link>
            <Searchbar />
            <ul>
                <li>
                    <NavLink to="/">
                        <BiNote className='link-icon' />
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/notes">
                        <BiNote className='link-icon' />
                        Notes
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/lists">
                        <BiNote className='link-icon' />
                        Lists
                    </NavLink>
                </li>
            </ul>
        </aside>
    </>)
}

export default Sidebar