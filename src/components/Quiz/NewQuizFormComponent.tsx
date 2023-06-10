import React, { ChangeEvent, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NewQuizFormState } from '../../interfaces';
import Navbar from '../Layout/NavbarComponent';
import { AuthContext } from '../User/AuthContext';

const NewQuizForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const [formState, setFormState] = useState<NewQuizFormState>({
    name: '',
    description: '',
    category: '',
    difficulty: 'LOW'
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted:', formState);
    const formData = {
      name: formState.name,
      description: formState.description,
      category: formState.category,
      difficulty: formState.difficulty,
      owner: authContext?.user?.login // TODO: change to current user name
    };

    // mode: 'cors', 
    // headers: { 'Content-Type': 'application/json' },
    // headers: { 'Content-Type': 'Question' },
    fetch('http://127.0.0.1:8080/quiz/new', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData) // body data type must match "Content-Type" header

    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log("new quiz:" + data);
          navigate('/quiz/all');
        }
      }).catch((error) => {
        console.error('Error:', error);
      });
    console.log(formData)
  };

  const handleGoBack = () => {
    navigate(`/quiz/all`);
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center">
        <div className="max-w-md bg-white rounded-lg p-8 shadow-lg mt-8 min-w-[50%]">
          <form id="myForm" onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                value={formState.name}
                id="name"
                name="name"
                placeholder="Enter the name of the quiz"
                onChange={handleChange}
                required
                className="border border-gray-300 px-4 py-2 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <textarea
                id="quizName"
                name="description"
                value={formState.description}
                placeholder="Write brief quiz description here..."
                onChange={handleChange}
                required
                className="border border-gray-300 px-4 py-2 rounded w-full"
              ></textarea>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={formState.category}
                name="category"
                id="category"
                placeholder="Enter quiz category name"
                onChange={handleChange}
                required
                className="border border-gray-300 px-4 py-2 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <select
                id="difficulty"
                name="difficulty"
                value={formState.difficulty}
                onChange={handleChange}
                required
                className="border border-gray-300 px-4 py-2 rounded w-full"
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className="mb-4">
              <button className="accent-button w-full" type="submit">Submit</button>
            </div>
          </form>

          <div className="mb-4">
            <button className="regular-button w-full" onClick={() => handleGoBack()}>Cancel</button>
          </div>
        </div>
      </div>
    </div>

  );
}

export default NewQuizForm;