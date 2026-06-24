import '../styles/dashlayout.css'
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useRef, useEffect } from "react";
import { Slide, ToastContainer } from 'react-toastify'

function DashLayout () {

    const mainRef = useRef();
    
    useEffect(() => {
        const parentElement = mainRef.current?.parentElement;

        if (parentElement) {
            parentElement.classList = ''
            parentElement.classList.add('dash-layout');
        }
    }, []);

    return (<>
        <Sidebar />
        <main ref={mainRef}>
            <Outlet />
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                pauseOnHover
                theme="light"
                transition={Slide}
			/>
        </main>
    </>)
}

export default DashLayout;