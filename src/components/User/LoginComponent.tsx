import { useNavigate } from 'react-router-dom'
import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AuthContext } from './AuthContext';
import * as Yup from 'yup';
import pl from 'yup-locale-pl';
import CentralLogoContainer from '../Layout/CentralLogoContainer';

Yup.setLocale(pl);

interface FormData {
  login: string,
  password: string,
}

const validationSchema = Yup.object().shape({
  login: Yup.string()
    .min(2, 'Login to short')
    .required('Login is required'),
  password: Yup.string()
    .min(8, 'Password to short')
    .required('Password is required'),
});

const LoginComponent: React.FC = () => {
  const initialValues = {
    login: '',
    password: '',
  };

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState('');
  const authContext = useContext(AuthContext);

  const handleRegisterClick = () => {
    navigate('/register')
  }

  const handleActivateClick = () => {
    navigate('/activate')
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
          authContext.login(data);
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
        setResponseMessage('An error occurred during login process.');
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
                    <Field type="password" id="password" name="password" autoComplete="current-password" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></Field>
                  </div>
                </div>

                <div>
                  <button type="submit" disabled={isSubmitting} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                </div>

                <ErrorMessage name="login" component="div" />
                <ErrorMessage name="password" component="div" />
              </Form>

              <p className="mt-10 text-center text-sm text-gray-500">
                No account yet? {" "}
                <button onClick={handleRegisterClick} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Register </button>
              </p>

              <p className="mt-1 text-center text-sm text-gray-500">
                Need to activate account? {" "}
                <button onClick={handleActivateClick} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Activate </button>
              </p>
            </div>

          </div>
        )}
      </Formik>


      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default LoginComponent;