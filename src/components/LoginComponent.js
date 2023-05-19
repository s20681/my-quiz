import { BrowserRouter, Route, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react';

function LoginComponent() {
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });

    const HandleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const HandleSubmit = event => {
        const navigate = useNavigate();

        if (event.formData.login === 'admin')
            navigate('/admin');
        else
            navigate('/')
    };

    return (
        <form onSubmit={HandleSubmit}>
            <input type="text" name="login"
                value={formData.login}
                onChange={HandleChange}
            />
            <input type="password" name="password"
                value={formData.password}
                onChange={HandleChange}
            />
            <button type='submit'>submit</button>
            {/* <NavLink to="/admin">admin</NavLink> */}
        </form>

    );
}

export default LoginComponent;