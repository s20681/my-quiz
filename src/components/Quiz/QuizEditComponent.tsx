import React, { useContext, useState, useEffect } from 'react';
import { Quiz, Question, Answer } from '../../interfaces';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../User/AuthContext';
import Navbar from '../Layout/NavbarComponent';

const QuestionListContainer = styled.div`
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

const QuizEdit: React.FC = () => {
  const location = useLocation();
  const [editedQuiz, setEditedQuiz] = useState<Quiz>();
  const navigate = useNavigate();
  const [responseMessage, setResponseMessage] = useState('');
  const [questions, setQuestions] = useState<Question[]>();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetch(`http://localhost:8080/quiz/get?id=${location.state.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(
        (response) => response.json())
      .then((data) => {
        if (data) {
          setEditedQuiz(data);
        } else {
          setResponseMessage("quiz data empty?");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponseMessage('An error occurred while fetching quiz to edit.');
      });
  }, [questions]);

  const handleEditQuestion = (question: Question) => {
    navigate(`/question/edit/${question.id}`, { state: question });
  };

  const handleCreateNewQuestion = () => {
    navigate(`/question/new`, { state: editedQuiz });
  };

  const handleDeleteQuestion = (questionId: any) => {
    fetch(`http://localhost:8080/question/remove?id=${questionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      setQuestions([])
    })
      .catch(error => {
        console.error('Error:', error);
        setResponseMessage('An error occurred while deleting the quiz.');
      });
  };

  const handleDeleteQuiz = () => {
    fetch(`http://localhost:8080/quiz/remove?id=${location.state.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      navigate(`/quiz/all`);
    })
      .catch(error => {
        console.error('Error:', error);
        setResponseMessage('An error occurred while deleting the quiz.');
      });
  };

  return (
    <div>
      {authContext.user ? (
        <div>
          <Navbar></Navbar>
          <QuestionListContainer>
            <p>Editing quiz: {editedQuiz?.name}, {editedQuiz?.description}</p>

            <button className='accent-button' onClick={() => handleCreateNewQuestion()}> Add new question </button>
            <button className='regular-button' onClick={() => handleDeleteQuiz()}> Delete the quiz </button>
            {editedQuiz?.questions?.length ? (
              <ul className="space-y-4">
              {editedQuiz?.questions.map((question, index) => (
                <li key={question.id}>
                  <div
                    onClick={() => handleEditQuestion(question)}
                    className="bg-white rounded-lg p-4 shadow-md cursor-pointer"
                  >
                    <div className="font-bold text-center mb-2">{question.content}</div>
                    <ul>
                      {question.answers.map((answer) => (
                        <li
                          key={answer.id}
                          className={`flex items-center ${answer.isCorrect ? 'font-bold text-green-500' : ''}`}
                        >
                          <span>{answer.content}</span>
                          <span className="ml-2">: {String(answer.isCorrect)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    className="regular-button mt-2"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    REMOVE
                  </button>
                </li>
              ))}
            </ul>
            ) : (
              <p>No questions available yet.</p>
            )}
          </QuestionListContainer>
        </div>
      ) : (
        <p>User not logged in</p>
      )}

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default QuizEdit;
