import { useEffect } from 'react';
import Form from '../components/Form';
import { Link } from 'react-router-dom';

function Login () {

    useEffect(() => {
        document.title = "EricaOS - Login";
    }, []);

    return (<>
        <Form route="accounts/token/create" method="login" />
    </>)
}

export default Login