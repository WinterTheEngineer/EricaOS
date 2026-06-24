import '../styles/AuthLayout.css';
import { Outlet } from "react-router-dom";
import { useEffect, useRef } from 'react';
import { Slide, ToastContainer } from 'react-toastify'

function AuthLayout () {

    const mainRef = useRef();

    useEffect(() => {
        const parentElement = mainRef.current?.parentElement;

        if (parentElement) {
            parentElement.classList = ''
            parentElement.classList.add('auth-layout');
        }
    }, []);
    
    return (
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
    )
}

export default AuthLayout;