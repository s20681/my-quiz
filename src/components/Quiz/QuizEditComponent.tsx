import { response } from 'express';
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
          console.log(data)
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
    //navigate to new question view
    navigate(`/question/new`, { state: editedQuiz });
  };

  const handleDeleteQuestion = (questionId: any) => {
    fetch(`http://localhost:8080/question/remove?id=${questionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      console.log("setting questions to null")
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
            <p>Logged in as username: {authContext.user.login} Id: {authContext.user.id}</p>
            <p>Currently editing quiz: {editedQuiz?.id} {editedQuiz?.name}</p>
            <button className='regular-button' onClick={() => handleCreateNewQuestion()}> Add new question </button>
            <button className='regular-button' onClick={() => handleDeleteQuiz()}> Delete the quiz </button>
            {editedQuiz?.questions?.length ? (
              <ul>
                {editedQuiz?.questions.map((question, index) => (
                  <li key={question.id}>
                    <div onClick={() => handleEditQuestion(question)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div>Question: {question.content}</div>
                      <div>Type: {question.questionType}</div>
                      <div>
                        <ul>
                          {question.answers.map((answer: Answer) => (
                            <li key={answer.id}>{answer.content} : {String(answer.isCorrect)}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <button className='regular-button' onClick={() => handleDeleteQuestion(question.id)}>REMOVE</button>
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
