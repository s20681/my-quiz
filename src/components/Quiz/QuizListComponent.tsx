import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../User/AuthContext';
import { Question, Quiz } from '../../interfaces';
import Navbar from '../Layout/NavbarComponent';

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

const QuizListComponent: React.FC = () => {
  const navigate = useNavigate();
  const [responseMessage, setResponseMessage] = useState('');
  const [quizzes, setQuizzes] = useState<Quiz[]>();
  const [filter, setFilter] = useState('');
  const [sortOption, setSortOption] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchQuizList();
  }, []);

  const fetchQuizList = () => {
    fetch('http://localhost:8080/quiz/getall', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(
        (response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.length > 0) {
          // Ustawienie pobranej listy quizów w stanie komponentu
          setQuizzes(data);
        } else {
          setResponseMessage("Quiz list seems empty for now.");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponseMessage('An error occurred while fetching quiz list.');
      });
  };

  const handleQuizClick = (quizId: number, index: number) => {
    if (quizzes !== undefined && quizzes[index].questions.length > 0) {
      var quizCopy = quizzes[index]
      quizCopy.questions = get10RandomQuestions(quizzes[index].questions);
      navigate(`/quiz/solve/${quizId}`, { state: quizzes[index] });
    } else {
      setResponseMessage("Quiz does not exist or does not have any questions yet.");
    }
  };

  const handleEditQuizClick = (quizId: number, index: number) => {
    if (quizzes !== undefined) {
      navigate(`/quiz/edit/${quizId}`, { state: quizzes[index] });
    } else {
      setResponseMessage("Something went wrong.");
    }
  };

  const handleCreateNew = () => {
    navigate(`/quiz/new`);
  };

  const handleRanking = () => {
    navigate(`/ranking`);
  };

  const handleSortOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  function get10RandomQuestions(array : Question[]) {
    const shuffledArray = array
      .map((item) => ({ item, sortKey: Math.random() })) // Assign a random sort key to each item
      .sort((a, b) => a.sortKey - b.sortKey); // Sort the items based on the sort key
  
    return shuffledArray.map((item) => item.item).slice(0, Math.min(10, array.length)); // Return at most 10 items
  }  

  // Helper function to convert difficulty string to numeric value for sorting
  const convertDifficultyToValue = (difficulty: string) => {
    switch (difficulty) {
      case 'LOW':
        return 1;
      case 'MEDIUM':
        return 2;
      case 'HIGH':
        return 3;
      default:
        return 0;
    }
  };

  // Sort the quizzes based on the selected sort option and order, usememo allows to calculate only if dependencies change.
  const filteredAndSortedQuizzes = useMemo(() => {
    return quizzes
      ?.filter((quiz) =>
        quiz.name.toLowerCase().includes(filter.toLowerCase()) || quiz.category.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        const compareValue = (order: 'asc' | 'desc') => {
          if (order === 'asc') {
            return 1;
          } else {
            return -1;
          }
        };

        if (sortOption === 'id') {
          return (a.id - b.id) * compareValue(sortOrder);
        } else if (sortOption === 'category') {
          return a.category.localeCompare(b.category) * compareValue(sortOrder);
        } else if (sortOption === 'difficulty') {
          return a.difficulty.localeCompare(b.difficulty) * compareValue(sortOrder);
        } else {
          return 0;
        }
      });
  }, [quizzes, filter, sortOption, sortOrder]);

  return (
    <div>
      {authContext.user ? (
        <div>
          <Navbar></Navbar>
          <QuizListContainer>
            <p>Logged in as username: {authContext.user.login} Id: {authContext.user.id}</p>
            <button className='regular-button' onClick={() => handleCreateNew()}> Create new quiz </button>
            <button className='regular-button' onClick={() => handleRanking()}> User ranking </button>

            <div>
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter by name or category"
              />

              Sort by:
              <select value={sortOption} onChange={handleSortOptionChange}>
                <option value="id">Created</option>
                <option value="category">Category</option>
                <option value="difficulty">Difficulty</option>
              </select>

              Order:
              <button className='regular-button' onClick={() => setSortOrder('asc')}>Sort Ascending</button>
              <button className='regular-button' onClick={() => setSortOrder('desc')}>Sort Descending</button>
            </div>
            <ul>

              {filteredAndSortedQuizzes?.map((quiz, index) => (
                <li key={quiz.id}>
                  <div
                    onClick={() => handleQuizClick(quiz.id, index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>Name: {quiz.name}</div>
                    <div>Category: {quiz.category}</div>
                    <div>Description: {quiz.description}</div>
                    <div>Difficulty: {quiz.difficulty}</div>
                    <div>Owner: {quiz.ownerName}</div>
                  </div>
                  {(authContext.user?.login === quiz.ownerName || authContext.user?.login === "admin") && <button className="accent-button" onClick={() => handleEditQuizClick(quiz.id, index)}>EDIT</button>}

                </li> 
              ))}
            </ul>
          </QuizListContainer>
        </div>

      ) : (
        <p>User not logged in</p>
      )}

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default QuizListComponent;
