import '../styles/Landing.css';
import api from '../api';
import { useEffect, useRef } from 'react';
import Nav from '../components/Nav';

function Landing() {

    const mainRef = useRef();
    
    useEffect(() => {
        document.title = "EricaOS | Lifestyle & Productivity Management"
        
        const parentElement = mainRef.current?.parentElement
        if (parentElement) {
            parentElement.classList = ''
        }
    }, [])

    // useEffect(() => {
    //     const checkHeartbeat = async () => {
    //         try {
    //             const res = await api.get("/api/heartbeat/");
    //         } catch (err) {
    //             console.error("Heartbeat failed:", err);
    //         }
    //     };

    //     checkHeartbeat();
    // }, []);

    return (
        <main ref={mainRef}>
            <Nav />
        </main>
    )
}

export default Landing;