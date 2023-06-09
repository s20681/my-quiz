import { useNavigate } from 'react-router-dom'
import React, { ChangeEvent, useState } from 'react';

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
            <form onSubmit={handleSubmit}>
            <input type="text" name="code"
                value={formData.code}
                onChange={handleChange}
            />
            <button className='accent-button' type='submit'>submit</button>
            <button className='regular-button' onClick={handleGoBackClick}>go back</button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
}

export default ActivateAccountComponent;