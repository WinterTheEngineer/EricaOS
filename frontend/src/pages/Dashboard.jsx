import { useEffect } from "react";

function Dashboard() {

    useEffect(() => {
        document.title = "Dashboard - EricaOS";
    }, []);

    return(<>
        <h3 className="site-header">Dashboard</h3>
    </>)
}

export default Dashboard