import '../styles/AuthLayout.css';
import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { Slide, ToastContainer } from 'react-toastify'

import { FaRotate } from "react-icons/fa6";

function AuthLayout () {

    const mainRef = useRef();

    useEffect(() => {
        const parentElement = mainRef.current?.parentElement;

        if (parentElement) {
            parentElement.classList = ''
            parentElement.classList.add('auth-layout');
        }
    }, []);
    
    const [heroId, setHeroId] = useState(() =>
        Math.floor(Math.random() * 10)
    );
    
    const rotateWallpaper = () => {
        setHeroId(Math.floor(Math.random() * 10));
    };

    return (<>
        <aside>
            <Outlet />
        </aside>
        <main ref={mainRef}>
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
            <img src={`/auth-wallpapers/${heroId}.webp`} className='hero-image' />
            <button
                id="rotate-wallpaper"
                onClick={() => rotateWallpaper()}
                className='erica-site-btn primary'>
                <FaRotate />
            </button>
        </main>
    </>)
}

export default AuthLayout;