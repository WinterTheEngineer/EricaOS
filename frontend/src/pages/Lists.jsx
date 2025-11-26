import { useEffect } from "react";

function Lists () {

    useEffect(() => {
        document.title = "EricaOS - Your Lists";
    }, []);

    return (<>
        <h3 className="site-header">Lists</h3>
    </>)
}

export default Lists