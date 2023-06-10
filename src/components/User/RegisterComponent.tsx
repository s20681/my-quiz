import React, { FormEvent, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup';
import styled from 'styled-components';
import pl from 'yup-locale-pl';
import CentralLogoContainer from '../Layout/CentralLogoContainer';

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

  const handleGoBackClick = () => {
    navigate('/login')
  }

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
          <div className="main-container">
            <CentralLogoContainer></CentralLogoContainer>
            <div className="form-container">
              <Form className="space-y-6">
                <div>
                  <label htmlFor="login" className="block text-sm font-medium leading-6 text-gray-900">Login</label>
                  <div className="mt-2">
                  <Field type="text" id="login" name="login" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></Field>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>

                  </div>
                  <div className="mt-2">
                  <Field type="password" id="password" name="password" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></Field>
                  </div>
                </div>


                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>

                  </div>
                  <div className="mt-2">
                  <Field type="email" id="email" name="email" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></Field>
                  </div>
                </div>

                <div>
                  <button type="submit" disabled={isSubmitting} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</button>
                </div>

              </Form>

              <p className="mt-10 text-center text-sm text-gray-500">
                Aleady registered? {" "}
                <button onClick={handleGoBackClick} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> go back </button>
              </p>

              <ErrorMessage className="mt-10" name="login" component="div" />
              <ErrorMessage className="mt-10" name="password" component="div" />
              <ErrorMessage className="mt-10" name="email" component="div" />
            </div>
          </div>
        )}
      </Formik>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default RegisterComponent;
