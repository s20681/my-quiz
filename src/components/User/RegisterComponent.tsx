import React, { FormEvent, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup';
import styled from 'styled-components';
import pl from 'yup-locale-pl';

Yup.setLocale(pl);

interface FormData {
    login: string,
    password: string,
    email: string
}

const InputLabel = styled.label`
  display: block;
`;

const validationSchema = Yup.object().shape({
    login: Yup.string()
    .min(2, 'Login musi składać się co najmniej z 2 znaków')
    .max(15, 'Login może składać się maksymalnie z 15 znaków')
    .required('Login jest wymagany'),
    password: Yup.string()
    .min(8, 'Hasło musi składać się co najmniej z 8 znaków')
    .max(25, 'Hasło może składać się maksymalnie z 25 znaków')
    .required('Hasło jest wymagane'),
    email: Yup.string()
    .email('Niepoprawny adres e-mail')
    .required('Adres e-mail jest wymagany')
});

const RegisterComponent: React.FC = () => {
  const initialValues = {
    login: '',
    password: '',
    email: ''
  };

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [formData, setformData] = useState(initialValues);
  const navigate = useNavigate();
 
  const handleSubmit = (values: FormData) => {
    setIsSubmitting(true);

    fetch('http://localhost:8080/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "true") {
          setResponseMessage('Registration successful! You will be redirected to activation screen.');
          setTimeout(() => {
            navigate('/activate');
          }, 5000); // Delay the redirection by 5000 milliseconds (5 seconds)

        } else {
          setResponseMessage('Registration failed. User already exists.');
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
              <InputLabel htmlFor="login">Login: </InputLabel>
              <Field type="text" id="login" name="login" />
            </div>
            <div>
              <InputLabel htmlFor="password">Hasło: </InputLabel>
              <Field type="password" id="password" name="password" />
            </div>
            <div>
              <InputLabel htmlFor="email">E-mail: </InputLabel>
              <Field type="email" id="email" name="email" />
            </div>
            <button className='regular-button' type="submit" disabled={isSubmitting}>
                {' '}
                Zarejestruj
              </button>

              <ErrorMessage name="login" component="div" />
              <ErrorMessage name="password" component="div" />
              <ErrorMessage name="email" component="div" />
          </Form>
        )}
      </Formik>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default RegisterComponent;
