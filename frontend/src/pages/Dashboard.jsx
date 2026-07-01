import '../styles/dashboard.css'
import { useEffect, useRef } from "react";
import ExchangeRateCard from '../components/ExchangeRateCard';

function Dashboard() {

    const mainRef = useRef()
    
    useEffect(() => {
        document.title = "Dashboard - EricaOS";
        
        const parentElement = mainRef.current?.parentElement;

        if (parentElement) {
            parentElement.classList = ''
            parentElement.id = 'dashboard';
        }

    }, []);

    return (
        <>
            <header ref={mainRef}>
                <h3 className="site-heading">Dashboard</h3>
            </header>
            <div className="main-content">
                <ExchangeRateCard />
            </div>
        </>
    )
}

export default Dashboard