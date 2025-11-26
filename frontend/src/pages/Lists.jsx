import { useEffect } from "react";

function Lists () {

    useEffect(() => {
        document.title = "EricaOS - Your Lists";
    }, []);

    return (<>
        <h1>Lists</h1>
    </>)
}

export default Lists