import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Ranking } from '../../interfaces';

const UserRankingContainer = styled.div`
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

const UserRanking: React.FC = () => {
  const navigate = useNavigate();
  const [ranking, setRanking] = useState<Ranking[]>();
  const [responseMessage, setResponseMessage] = useState('');

  const handleGotoMain = () => {
    navigate(`/quiz/all`);
  };

  useEffect(() => {
    fetchHighscores();
  }, []);

  const fetchHighscores = () => {
    fetch(`http://localhost:8080/user/ranking`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(
        (response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setRanking(data);
          console.log(JSON.stringify(data))
        } else {          
          setResponseMessage("Ranking list seems empty.");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponseMessage('An error occurred while fetching ranking data.');
      });
  };

  return (
    <UserRankingContainer>
      <ul>
        {ranking?.map((rank, index) => (
          <li key={index}>
            <div>User: {rank.userName}</div>
            <div>Total points: {rank.totalPoints}</div>
            <div>Total quizzes solved: {rank.totalQuizzes}</div>
            <div>Easy: {rank.totalEasyQuizzes}</div>
            <div>Medium: {rank.totalMediumQuizzes}</div>
            <div>Hard: {rank.totalHardQuizzes}</div>
          </li>
        ))}
      </ul>
      <button onClick={() => handleGotoMain()}> Back to quizzes </button>

      {responseMessage && <p>{responseMessage}</p>}
    </UserRankingContainer>
  );
};

export default UserRanking;
