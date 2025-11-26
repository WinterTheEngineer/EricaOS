import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function DashLayout () {

    return (<>
        <Sidebar />
        <main>
            <Outlet />
        </main>
    </>)
}

export default DashLayout;