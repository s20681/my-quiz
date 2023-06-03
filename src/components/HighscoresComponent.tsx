import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Highscore } from '../interfaces';

const HighScoresContainer = styled.div`
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #f5f5f5;
    }
  }
`;


const highscoresMock = [
    {"id": 1, "time": "2m 30s", "points": 10, "userName": "best_user"},
    {"id": 2, "time": "7m 23s", "points": 6, "userName": "admin"},
    {"id": 3, "time": "1m 06s", "points": 1, "userName": "best_user"},
]

const HighScores: React.FC = () => {
  const navigate = useNavigate();
  const [responseMessage, setResponseMessage] = useState('');
  const [highscores, setHighscores] = useState<Highscore[]>();

  useEffect(() => {
    fetchQuizList();
  }, []);

  const fetchQuizList = () => {
    fetch('http://localhost:8080/highscore/getall', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(
        (response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          // Ustawienie pobranej listy quizów w stanie komponentu
          setHighscores(data);
        } else {          
          setResponseMessage("Highscores list seems empty.");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponseMessage('An error occurred while fetching quiz list.');
      });
  };

  const handleGotoMain = () => {
    navigate(`/quiz/all`);
  };

  return (
    <HighScoresContainer>
      <ul>
        {highscoresMock.map((score, index) => (
          <li key={score.id}>
            <div>Points: {score.points}</div>
            <div>Time: {score.time}</div>
            <div>User: {score.userName}</div>
          </li>
        ))}
      </ul>
      <button onClick={() => handleGotoMain()}> Back to quizzes </button>
    </HighScoresContainer>
  );
};

export default HighScores;
