import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const QuizListContainer = styled.div`
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

interface Quiz {
  id: number;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  ownerName: string;
  questions: any[];
}

interface QuizListComponentProps {
  quizzes: Quiz[];
}

const QuizListComponent: React.FC<QuizListComponentProps> = ({ quizzes }) => {
  const navigate = useNavigate();

  const handleQuizClick = (quizId: number) => {
    // Handle quiz click, navigate to the quiz component or perform any other action
    navigate(`/quiz/${quizId}`);
  };

  return (
    <QuizListContainer>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id} onClick={() => handleQuizClick(quiz.id)}>
            <div>Name: {quiz.name}</div>
            <div>Category: {quiz.category}</div>
            <div>Description: {quiz.description}</div>
            <div>Difficulty: {quiz.difficulty}</div>
            <div>Owner: {quiz.ownerName}</div>
          </li>
        ))}
      </ul>
    </QuizListContainer>
  );
};

export default QuizListComponent;
