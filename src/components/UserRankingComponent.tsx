import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

// interface QuizSolutionRecord {
//   id: number;
//   time: string;
//   points: number;
//   userName: string;
// }

const highscoresMock = [
    {"id": 1, "time": "2m 30s", "points": 10, "userName": "best_user"},
    {"id": 2, "time": "7m 23s", "points": 6, "userName": "admin"},
    {"id": 3, "time": "1m 06s", "points": 1, "userName": "best_user"},
]

const UserRanking: React.FC = () => {
  const navigate = useNavigate();

  const handleGotoMain = () => {
    navigate(`/quiz/all`);
  };

  return (
    <UserRankingContainer>
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
    </UserRankingContainer>
  );
};

export default UserRanking;
