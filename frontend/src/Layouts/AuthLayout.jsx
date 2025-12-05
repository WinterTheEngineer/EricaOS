import '../styles/AuthLayout.css';
import { Outlet } from "react-router-dom";
import sidebarLogo from '../assets/sidebar-logo.png';

function AuthLayout () {

    return (<>
        <main>
            <img src={sidebarLogo} alt="Erica Logo" className='logo' />
            <Outlet />
        </main>
    </>)
}

export default AuthLayout;