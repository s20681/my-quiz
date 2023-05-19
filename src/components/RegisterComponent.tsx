import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import pl from 'yup-locale-pl';

Yup.setLocale(pl);

interface Employee {
    login: string,
    password: string,
    email: string
}

const InputLabel = styled.label`
  display: block;
`;

const initialValues = {
  login: '',
  password: '',
  email: ''
};

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

const RegisterComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);


  const handleSubmit = (values: any, { resetForm }: any): void => {
    setIsSubmitting(true);
    setTimeout(() => {
      setEmployees([...employees, values]);
      setIsSubmitting(false);
      resetForm();
    }, 500);
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
            <button type="submit" disabled={isSubmitting}>
                {' '}
                Zarejestruj
              </button>

              <ErrorMessage name="login" component="div" />
              <ErrorMessage name="password" component="div" />
              <ErrorMessage name="email" component="div" />
          </Form>
        )}
      </Formik>
      <ul>
        {employees.map((employee, index) => (
          <li key={index}>
            <p>Login: {employee.login} </p>
            <p>Hasło: {employee.password} </p>
            <p>Email: {employee.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegisterComponent;
