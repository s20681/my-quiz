import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Highscore } from '../../interfaces';
import Navbar from '../Layout/NavbarComponent';

const HighScores: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [quizId, setQuizId] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [highscores, setHighscores] = useState<Highscore[]>();

  useEffect(() => {
    if (location.state) {
      setQuizId(location.state.id)
    }
  }, [location.state]);

  useEffect(() => {
    if (quizId) {
      fetchHighscores();
    }
  }, [quizId]);

  const fetchHighscores = () => {
    fetch(`http://localhost:8080/highscore/get?id=${quizId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(
        (response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setHighscores(data);
        } else {
          setResponseMessage("Highscores list seems empty.");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponseMessage('An error occurred while fetching highscores.');
      });
  };

  const handleGotoMain = () => {
    navigate(`/quiz/all`);
  };

  return (
    <div>
      <Navbar></Navbar>
      {highscores && (
        <div>
          <div className="w-90% mx-auto bg-white rounded-lg shadow-lg p-6">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Points
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {highscores?.map((score, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {score.userName || 'Unknown'}
                    </th>
                    <td className="px-6 py-4">
                      {score.points}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(score.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className='accent-button' onClick={() => handleGotoMain()}> Back to quizzes </button>

          {responseMessage && <p>{responseMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default HighScores;
