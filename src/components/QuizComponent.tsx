import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Quiz } from '../interfaces';
import styled from 'styled-components';

const QuizContainer = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const QuizComponent: React.FC = () => {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [timer, setTimer] = useState<number>(30);

  const handleAnswer = useCallback(
    (selectedAnswerIndex: number | null) => {
      const currentQuestion = selectedQuiz!.questions[currentQuestionIndex];
      console.log(currentQuestion);
      console.log("selected answer index" + selectedAnswerIndex);
  
      if (selectedAnswerIndex !== null && currentQuestion.answers[selectedAnswerIndex].isCorrect) {
        console.log("trying to add points!");
        setPoints((prevPoints) => prevPoints + 1);
      }
  
      if (currentQuestionIndex + 1 <= selectedQuiz!.questions.length) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setTimer(30); // Reset timer for the next question
      }
    },
    [selectedQuiz, currentQuestionIndex]
  );

  useEffect(() => {
    // Fetch the selected quiz data based on the quiz ID or any other identifier
    // For simplicity, we'll set it to the first quiz in mockedData
    setSelectedQuiz(location.state);
    console.log(location.state);
  }, [location.state]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    if (timer === 0) {
      clearInterval(interval);
      handleAnswer(null); // Handle timeout as an unanswered question
    }

    return () => clearInterval(interval);
  }, [timer, handleAnswer]);

  useEffect(() => {
    if (selectedQuiz !== null && currentQuestionIndex >= selectedQuiz!.questions.length ) {
      alert(`Quiz completed! You scored ${points} points.`);
      console.log({ userId: authContext.user?.id, quizId: selectedQuiz?.id, points: points })

      fetch('http://127.0.0.1:8080/highscore/add', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: authContext.user?.id, quizId: selectedQuiz?.id, points: points }) // body data type must match "Content-Type" header

      })
        .then((response) => {
          if (response.ok) {
            navigate('/quiz/highscores', { state: selectedQuiz });
          } else {
            throw new Error('Error: ' + response.status);
          }
        })
    }
  }, [currentQuestionIndex, handleAnswer]);

  if (!selectedQuiz) {
    return <div>Loading...</div>;
  }

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];

  return (
    <div>
      <h2>{selectedQuiz.name}</h2>
      <p>{selectedQuiz.description}</p>
      {currentQuestion && (
        <QuizContainer>
          <h3>Question {currentQuestionIndex + 1}</h3>
          <p>{currentQuestion.content}</p>
          <p>Time remaining: {timer}s</p>
          <ul>
            {currentQuestion.answers.map((answer, index) => (
              <li key={index}>
                <button onClick={() => handleAnswer(index)} disabled={timer === 0}>
                  {answer.content}
                </button>
              </li>
            ))}
          </ul>
        </QuizContainer>
      )}
    </div>
  );
};

export default QuizComponent;
