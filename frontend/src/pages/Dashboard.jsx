import '../styles/dashboard.css'
import { useEffect, useRef } from "react";
import ExchangeRateCard from '../components/ExchangeRateCard';
import { useOutletContext } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';

function Dashboard() {

    const mainRef = useRef()
    const { profile, setActiveScene } = useOutletContext();

    const username = profile?.short_name
    
    useEffect(() => {
        document.title = "Dashboard - EricaOS";
        
        const parentElement = mainRef.current?.parentElement;

        if (parentElement) {
            parentElement.classList = ''
            parentElement.id = 'dashboard';
        }
        setActiveScene('dashboard')
    }, []);

    return (
        <>
            <header ref={mainRef}>
                {!username ? (
                    <SkeletonLoader classNames={'header-username-skeleton'} />
                ) :
                <h3 className="erica-site-heading">Welcome back, {username}</h3>
                }
            </header>
            <div className="main-content">
                <ExchangeRateCard />
            </div>
        </>
    )
}

export default Dashboard