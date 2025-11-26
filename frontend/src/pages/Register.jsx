import Form from "../components/Form";
import { Link, useNavigate } from 'react-router-dom';

function Register () {

    return (<>
        <Form route="accounts/register/" method="register" />
    </>)
}

export default Register