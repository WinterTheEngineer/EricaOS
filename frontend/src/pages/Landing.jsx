import '../styles/Landing.css';
import { useEffect } from 'react';
import Nav from '../components/Nav';

function Landing() {

    document.title = "EricaOS | Lifestyle & Productivity Management"

    return (
        <>
            <Nav />
        </>
    )
}

export default Landing;