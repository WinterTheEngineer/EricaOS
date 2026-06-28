import '../styles/Landing.css';
import api from '../api';
import { useEffect } from 'react';
import Nav from '../components/Nav';

function Landing() {

    document.title = "EricaOS | Lifestyle & Productivity Management"

    useEffect(() => {
        const checkHeartbeat = async () => {
            try {
                await api.get("/api/heartbeat/");
            } catch (err) {
                console.error("Heartbeat failed:", err);
            }
        };

        checkHeartbeat();
    }, []);

    return (
        <>
            <Nav />
        </>
    )
}

export default Landing;