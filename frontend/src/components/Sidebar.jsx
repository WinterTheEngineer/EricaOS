import '../styles/globals.css'
import Notes from '../pages/Notes'
import sidebarLogo from '../assets/sidebar-logo.png';
import { Link, NavLink } from 'react-router-dom'

function Sidebar () {

    return (<>
        <aside id="sidebar">
            <Link to={'/'}>
                <img src={sidebarLogo} className='logo' alt="The Official EricaOS Logo" />
            </Link>
            <ul>
                <li>
                    <NavLink to="/">Notes</NavLink>
                </li>
                <li>
                    <NavLink to="/Lists">Lists</NavLink>
                </li>
            </ul>
        </aside>
    </>)
}

export default Sidebar