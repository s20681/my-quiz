import { useNavigate } from 'react-router-dom'
import React, { ChangeEvent, useState } from 'react';
import CentralLogoContainer from '../Layout/CentralLogoContainer';

const ActivateAccountComponent: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [formData, setFormData] = useState({
    code: '',
  });
  const navigate = useNavigate();

  const handleGoBackClick = () => {
    navigate('/login')
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {

    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    fetch(`http://localhost:8080/user/activate?code=${formData.code}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success == "true") {
          setResponseMessage('Activation successful! You will be redirected to login screen.');
          setTimeout(() => {
            navigate('/login');
          }, 5000); // Delay the redirection by 5000 milliseconds (5 seconds)              
        } else {
          setResponseMessage('Activation failed.');
        }
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponseMessage('An error occurred during activation.');
      });
  };

  return (
    <div>
      <div className="main-container">
        <CentralLogoContainer></CentralLogoContainer>
        <div className="form-container">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="login" className="block text-sm font-medium leading-6 text-gray-900">Activation code</label>
              <div className="mt-2">
                <input type="text" name="code" value={formData.code} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
              </div>
            </div>

            <div>
              <button type="submit" disabled={isSubmitting} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit</button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Aleady activated? {" "}
            <button onClick={handleGoBackClick} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> go back </button>
          </p>

          {responseMessage && <p>{responseMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default ActivateAccountComponent;