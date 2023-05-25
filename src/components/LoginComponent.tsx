import { useNavigate } from 'react-router-dom'
import React, { ChangeEvent, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import pl from 'yup-locale-pl';

Yup.setLocale(pl);

interface FormData {
    login: string,
    password: string,
}

const validationSchema = Yup.object().shape({
    login: Yup.string()
    .min(2, 'Login za krótki')
    .required('Login jest wymagany'),
    password: Yup.string()
    .min(8, 'Hasło za krótkie')
    .required('Hasło jest wymagane'),
});

const LoginComponent: React.FC = () => {
    const initialValues = {
        login: '',
        password: '',
      };

    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [responseMessage, setResponseMessage] = useState('');
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

      const handleRegisterClick = () => {
        navigate('/register')
     }

      const handleSubmit = (values: FormData) => {
        setIsSubmitting(true);
    
        fetch('http://localhost:8080/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success === "true") {
              setResponseMessage('Login successful! You will be redirected to home screen.');
              setTimeout(() => {
                navigate('/quiz/all');
              }, 5000);
    
            } else if (data.redirect === "activate") {
              setResponseMessage('You need to activate your account first. You will be redirected to activation screen.');
              setTimeout(() => {
                navigate('/activate');
              }, 5000);
            } else {
                setResponseMessage(data.message);
            }
            setIsSubmitting(false);
          })
          .catch((error) => {
            console.error('Error:', error);
            setResponseMessage('An error occurred during registration.');
          });
      };

    return (
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div>
                  <label htmlFor="login">Login: </label>
                  <Field type="text" id="login" name="login" />
                </div>
                <div>
                  <label htmlFor="password">Hasło: </label>
                  <Field type="password" id="password" name="password" />
                </div>

                <button type="submit" disabled={isSubmitting}>
                    {' '}
                    Zaloguj
                </button>

                <button onClick={handleRegisterClick}>
                  Zarejestruj się
                </button>
    
                  <ErrorMessage name="login" component="div" />
                  <ErrorMessage name="password" component="div" />
              </Form>
            )}
          </Formik>
    
          {responseMessage && <p>{responseMessage}</p>}
        </div>
      );
}

export default LoginComponent;