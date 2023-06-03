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
          setHighscores(data);
          console.log(JSON.stringify(data))
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
    <div>
    {highscores && (
    <HighScoresContainer>
      
      <ul>
        {highscores.map((score, index) => (
          <li key={score.id}>
            <div>Points: {score.points}</div>
            <div>Time: {new Date(score.date).toLocaleString()}</div>
            <div>User: {score.person?.login || 'Unknown'}</div>
          </li>
        ))}
      </ul>
      <button onClick={() => handleGotoMain()}> Back to quizzes </button>

      {responseMessage && <p>{responseMessage}</p>}
    </HighScoresContainer>
    )}
    </div>
  );
};

export default HighScores;
