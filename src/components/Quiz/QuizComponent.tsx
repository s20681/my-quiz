import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../User/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Quiz } from '../../interfaces';
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

  // wrapped with useCallback so handleAnswer can be a dependecy of useEffect 
  const handleAnswer = useCallback(
    (selectedAnswerIndex: number | null) => {
      const currentQuestion = selectedQuiz!.questions[currentQuestionIndex];

      if (selectedAnswerIndex !== null && currentQuestion.answers[selectedAnswerIndex].isCorrect) {
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
    setSelectedQuiz(location.state);
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
    if (selectedQuiz !== null && currentQuestionIndex >= selectedQuiz!.questions.length) {
      alert(`Quiz completed! You scored ${points} points.`);
      console.log({ userId: authContext.user?.id, quizId: selectedQuiz?.id, points: points })

      fetch('http://127.0.0.1:8080/highscore/add', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: authContext.user?.id, quizId: selectedQuiz?.id, points: points })

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

      {currentQuestion && (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white rounded-lg p-8 shadow-lg min-w-[50%]">
          <p className="text-gray-600 mb-4">Question {currentQuestionIndex + 1} / {selectedQuiz.questions.length}</p>
          <h2 className="text-2xl mb-4">{currentQuestion.content}</h2>
          <p className="text-gray-600 mb-4">Time remaining: {timer}s</p>
          <div className="flex flex-col space-y-4">
          {currentQuestion.answers.map((answer, index) => (
              <div key={index}>
                <button onClick={() => handleAnswer(index)} disabled={timer === 0} className="bg-blue-500 text-white py-2 px-4 rounded w-full">
                  {answer.content}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

)}
    </div>
  );
};

export default QuizComponent;
