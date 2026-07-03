import '../styles/DashLayout.css'
import api from '../api';
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useRef, useEffect, useState } from "react";
import { Slide, ToastContainer } from 'react-toastify'

function DashLayout () {

    const mainRef = useRef();
    const [profile, setProfile] = useState({})
    
    useEffect(() => {
        const parentElement = mainRef.current?.parentElement;

        if (parentElement) {
            parentElement.classList = ''
            parentElement.classList.add('dash-layout');
        }
    }, []);

    useEffect(() => {
        const getDisplayProfile = async () => {
            try {
                const res = await api.get("/accounts/display-profile/");
                console.log(res.data);

                setProfile(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        getDisplayProfile()
    }, [])

    return (<>
        <Sidebar profile={profile} />
        <main ref={mainRef}>
            <Outlet context={profile} />
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