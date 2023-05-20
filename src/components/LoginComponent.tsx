import { useNavigate } from 'react-router-dom'
import React, { ChangeEvent, useState } from 'react';

const LoginComponent: React.FC = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });

    const HandleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value,
        }));
      };

    const HandleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        const navigate = useNavigate();

        if (formData.login === 'admin')
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