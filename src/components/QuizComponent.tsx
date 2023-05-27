import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const QuizContainer = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
`;

interface Answer {
  id: number;
  content: string;
  correct: boolean;
}

interface Question {
  id: number;
  content: string;
  correctAnswerIndex: number;
  questionType: string;
  answers: Answer[];
}

interface Quiz {
  id: number;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  ownerName: string;
  questions: Question[];
}

const QuizComponent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [timer, setTimer] = useState<number>(30);

  useEffect(() => {
    // Fetch the selected quiz data based on the quiz ID or any other identifier
    // For simplicity, we'll set it to the first quiz in mockedData
    setSelectedQuiz(location.state);
    console.log(location.state);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    if (timer === 0) {
      clearInterval(interval);
      handleAnswer(null); // Handle timeout as an unanswered question
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleAnswer = (selectedAnswerIndex: number | null) => {
    const currentQuestion = selectedQuiz!.questions[currentQuestionIndex];

    if (selectedAnswerIndex !== null && currentQuestion.answers[selectedAnswerIndex].correct) {
      setPoints((prevPoints) => prevPoints + 1);
    }

    if (currentQuestionIndex + 1 < selectedQuiz!.questions.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimer(30); // Reset timer for the next question
    } else {
      // End of quiz, display points
      alert(`Quiz completed! You scored ${points} points.`);
      //TODO: send quiz results to backend
      navigate('/quiz/highscores'); // Redirect to quiz list or any other page
    }
  };

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
