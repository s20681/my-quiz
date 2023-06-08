import { useNavigate } from 'react-router-dom'
import React, { ChangeEvent, useState, useContext, useCallback, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AuthContext } from './AuthContext';
import * as Yup from 'yup';
import { UserData } from '../../interfaces';

interface changePasswordFormData {
  oldPassword: string,
  newPassword: string,
}

interface removeAccountFormData {
  login: string,
  password: string,
}

const passwordChangeValidationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(8, 'Old password to short')
    .required('Old password is required'), dpa: Yup.string(),

  newPassword: Yup.string()
    .min(8, 'New password to short')
    .required('New password is required'),
});

const removeAccountValidationSchema = Yup.object().shape({
  login: Yup.string()
    .min(2, 'Login to short')
    .required('Login is required'),
  password: Yup.string()
    .min(8, 'Password to short')
    .required('Password is required')
});

const ManageAccountComponent: React.FC = () => {

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState('');
  const authContext = useContext(AuthContext);
  const [userData, setUserData] = useState<UserData>();
  const [allUserData, setAllUserData] = useState<UserData[]>();
  const [changePasswordFormData, setChangePasswordFormData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  const [removeAccountFormData, setRemoveAccountFormData] = useState({
    login: '',
    password: ''
  });

  useEffect(() => {
    fetchUserDetails();

    console.log(authContext.user?.login)
    if (authContext.user?.login === "admin") {
      fetchAllUserDetails();
    }
  }, []);

  const fetchUserDetails = () => {
    fetch(`http://localhost:8080/user/get?id=${authContext.user?.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(
        (response) => response.json())
      .then((data) => {
        console.log(data);
        if (data) {
          setUserData(data);
        } else {
          setResponseMessage("No user data.");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponseMessage('An error occurred while fetching user data.');
      });
  }

  const fetchAllUserDetails = () => {
    console.log("fetching data for admin")
    fetch(`http://localhost:8080/user/getall`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(
        (response) => response.json())
      .then((data) => {
        console.log(data);
        if (data) {
          setAllUserData(data);
        } else {
          setResponseMessage("No all user data.");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponseMessage('An error occurred while fetching user list.');
      });
  }

  const handleGoHome = () => {
    navigate('/quiz/all')
  }

  // wrapping inside of useCallback to handle the event and pass the necessary values
  const handleRemoveAccount = (values: removeAccountFormData) => {
    console.log("removing account");

    const requestData = {
      ...values,
      contextLogin: authContext.user!.login
    };

    fetch(`http://localhost:8080/user/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "true") {
          setResponseMessage('Password change successful! You will be redirected to login screen.');
          setTimeout(() => {
            authContext.logout();
            navigate('/login');
          }, 5000);
        } else {
          setResponseMessage(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponseMessage('An error occurred during the process.');
      });
  };

  const handleSubmitPasswordChange = (values: changePasswordFormData) => {
    setIsSubmitting(true);

    const requestData = {
      ...values,
      contextLogin: authContext.user!.login
    };

    fetch(`http://localhost:8080/user/passwordchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "true") {
          setResponseMessage('Account removed successful! You will be redirected to login screen.');
          setTimeout(() => {
            authContext.logout();
            navigate('/login');
          }, 5000);
        } else {
          setResponseMessage('Could not change the password. Please double check original password.');
        }
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponseMessage('An error occurred during the process.');
      });
  };

  return (
    <div>
      {authContext.user ? (
        <div>
          {userData && (
            <div>
              <h3>Account details:</h3>
              <div>ID: {userData.id}</div>
              <div>Login: {userData.login}</div>
              <div>Email: {userData.email}</div>
              <div>Status: {userData.isActivated ? "Active" : "Inactive"}</div>
            </div>
          )}

          <hr></hr>

          <Formik
            initialValues={changePasswordFormData}
            validationSchema={passwordChangeValidationSchema}
            onSubmit={handleSubmitPasswordChange}
          >
            {({ errors, touched }) => (
              <Form autoComplete="off">
                <div>
                  <div></div>
                </div>
                <div>
                  <label htmlFor="oldPassword">Old password: </label>
                  <Field type="password" id="oldPassword" name="oldPassword" />
                </div>

                <div>
                  <label htmlFor="newPassword">New password: </label>
                  <Field type="password" id="newPassword" name="newPassword" />
                </div>

                <button type="submit" disabled={isSubmitting}>
                  {' '}
                  Change password
                </button>

                <ErrorMessage name="oldPassword" component="div" />
                <ErrorMessage name="newPassword" component="div" />
              </Form>
            )}
          </Formik>

          <hr></hr>

          <Formik
            initialValues={removeAccountFormData}
            validationSchema={removeAccountValidationSchema}
            onSubmit={handleRemoveAccount}
          >
            <Form autoComplete="off">
              <div>If you want to permanently delete your account input your login / password below and press the button.</div>
              <div>
                <label htmlFor="login">Login: </label>
                <Field type="text" id="login" name="login" autoComplete="off" />
              </div>

              <div>
                <label htmlFor="password">Hasło: </label>
                <Field type="password" id="password" name="password" autoComplete="off" />
              </div>

              <button type="submit" disabled={isSubmitting}>
                {' '}
                Remove account
              </button>

              <ErrorMessage name="password" component="div" />
              <ErrorMessage name="login" component="div" />
            </Form>
          </Formik>

          <button onClick={() => handleGoHome()}> Go back to quiz list </button>

          <hr></hr>

          {allUserData && (
            <div>
              <h3>All existing accounts details:</h3>
              {allUserData?.map((userDetails, index) => (
                <li key={index}>
                  <div>ID: {userDetails.id}</div>
                  <div>User: {userDetails.login}</div>
                  <div>User: {userDetails.email}</div>
                  <div>User: {userDetails.verificationCode}</div>
                  <div>Status: {userDetails.isActivated ? "Active" : "Inactive"}</div>
                  <button> REMOVE USER </button>
                </li>
              ))}
            </div>


          )}



        </div>
      ) : (
        <p>User not logged in</p>
      )}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default ManageAccountComponent;