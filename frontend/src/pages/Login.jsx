import Form from '../components/Form';
import { Link } from 'react-router-dom';

function Login () {

    return (<>
        <Form route="api/token/create" method="login" />
    </>)
}

export default Login