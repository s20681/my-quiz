import { useNavigate } from 'react-router-dom'
import React, { useState, useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AuthContext } from './AuthContext';
import * as Yup from 'yup';
import { UserData } from '../../interfaces';
import Navbar from '../Layout/NavbarComponent';

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
  const [passwordChangeResponseMessage, setpasswordChangeResponseMessage] = useState('');
  const [accountRemovalResponseMessage, setaccountRemovalResponseMessage] = useState('');
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
    fetch(`http://localhost:8080/user/getall`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(
        (response) => response.json())
      .then((data) => {
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

  const handleRemoveAccount = (values: removeAccountFormData) => {
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
          setaccountRemovalResponseMessage('Account removed successful! You will be redirected to login screen.');
          setTimeout(() => {
            authContext.logout();
            navigate('/login');
          }, 5000);
        } else {
          setaccountRemovalResponseMessage(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setaccountRemovalResponseMessage('An error occurred during the process.');
      });
  };

  const handleRemoveAccountByAdmin = (userToRemoveID: string) => {

    const requestData = {
      contextLogin: authContext.user!.login,
      userId: userToRemoveID
    };

    fetch(`http://localhost:8080/user/administration/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "true") {
          fetchAllUserDetails();
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
          setpasswordChangeResponseMessage('Password change successful! You will be redirected to login screen.');
          setTimeout(() => {
            authContext.logout();
            navigate('/login');
          }, 5000);
        } else {
          setpasswordChangeResponseMessage('Could not change the password. Please double check original password.');
        }
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setpasswordChangeResponseMessage('An error occurred during the process.');
      });
  };

  return (
    <div>
      {authContext.user ? (
        <div>
          <Navbar></Navbar>

          <div className="flex justify-center">
            <div className="max-w-lg">
              {userData && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  <h3 className="text-center">Account details:</h3>
                  <div>ID: {userData.id}</div>
                  <div>Login: {userData.login}</div>
                  <div>Email: {userData.email}</div>
                  <div>Status: {userData.isActivated ? "Active" : "Inactive"}</div>
                </div>
              )}

              <Formik
                initialValues={changePasswordFormData}
                validationSchema={passwordChangeValidationSchema}
                onSubmit={handleSubmitPasswordChange}
              >
                {({ errors, touched }) => (
                  <Form className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="mb-4">
                      <label htmlFor="oldPassword">Old password:</label>
                      <Field
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage name="oldPassword" component="div" className="text-red-500" />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="newPassword">New password:</label>
                      <Field
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage name="newPassword" component="div" className="text-red-500" />
                    </div>

                    <button type="submit" className="accent-button" disabled={isSubmitting}>
                      Change password
                    </button>
                  </Form>
                )}
              </Formik>
              {passwordChangeResponseMessage && <p>{passwordChangeResponseMessage}</p>}

              <Formik
                initialValues={removeAccountFormData}
                validationSchema={removeAccountValidationSchema}
                onSubmit={handleRemoveAccount}
              >
                <Form className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  <div className="mb-4">If you want to permanently delete your account, input your login/password below and press the button.</div>

                  <div className="mb-4">
                    <label htmlFor="login">Login:</label>
                    <Field
                      type="text"
                      id="login"
                      name="login"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      autoComplete="off"
                    />
                    <ErrorMessage name="login" component="div" className="text-red-500" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password">Password:</label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      autoComplete="off"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500" />
                  </div>

                  <button type="submit" className="accent-button" disabled={isSubmitting}>
                    Remove account
                  </button>
                </Form>
              </Formik>
              {accountRemovalResponseMessage && <p>{accountRemovalResponseMessage}</p>}
            </div>
          </div>

          {allUserData && (
            <div>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Verification Code
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Remove
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUserData?.map((userDetails, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {userDetails.id}
                      </th>
                      <td className="px-6 py-4">
                        {userDetails.login}
                      </td>
                      <td className="px-6 py-4">
                        {userDetails.email}
                      </td>
                      <td className="px-6 py-4">
                        {userDetails.verificationCode}
                      </td>
                      <td className="px-6 py-4">
                        {userDetails.isActivated ? "Active" : "Inactive"}
                      </td>
                      <td className="px-6 py-4">
                        {(userDetails.login !== "admin") && (
                          <button
                            onClick={(event) => {
                              event.stopPropagation(); // Stop event propagation
                              handleRemoveAccountByAdmin(userDetails.id);
                            }}
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          >
                            Delete account
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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