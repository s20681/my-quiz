import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../User/AuthContext';
import { Question, Quiz } from '../../interfaces';
import Navbar from '../Layout/NavbarComponent';

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

  const handleSortOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  function get10RandomQuestions(array: Question[]) {
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
        quiz.name.toLowerCase().includes(filter.toLowerCase()) || quiz.category.toLowerCase().includes(filter.toLowerCase()) || quiz.ownerName.toLowerCase().includes(filter.toLowerCase())
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
          <p>Logged in as username: {authContext.user.login}</p>

          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Filter by:</span>
                <input type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter by name, user or category" className="border border-gray-300 px-2 py-1 rounded-sm" />
              </div>

              <div className="relative">
                <select value={sortOption} onChange={handleSortOptionChange} className="appearance-none border border-gray-300 px-2 py-1 rounded-sm">
                  <option value="id">Created</option>
                  <option value="category">Category</option>
                  <option value="difficulty">Difficulty</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button onClick={() => setSortOrder('asc')} className="px-3 py-1 rounded bg-blue-500 text-white">Asc</button>
                <button onClick={() => setSortOrder('desc')} className="px-3 py-1 rounded bg-blue-500 text-white">Desc</button>
              </div>

              <div>
                <button className='px-3 py-1 rounded bg-blue-500 text-white' onClick={() => handleCreateNew()}> Create new quiz </button>
              </div>
            </div>


            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            </div>
          </div>

          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Quiz name
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Difficulty
                </th>
                <th scope="col" className="px-6 py-3">
                  Owner
                </th>
                <th scope="col" className="px-6 py-3">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedQuizzes?.map((quiz, index) => (
                <tr key={quiz.id} onClick={() => handleQuizClick(quiz.id, index)} style={{ cursor: 'pointer' }} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {quiz.name}
                  </th>
                  <td className="px-6 py-4">
                    {quiz.category}
                  </td>
                  <td className="px-6 py-4">
                    {quiz.description}
                  </td>
                  <td className="px-6 py-4">
                    {quiz.difficulty}
                  </td>
                  <td className="px-6 py-4">
                    {quiz.ownerName}
                  </td>
                  <td className="px-6 py-4">
                    {(authContext.user?.login === quiz.ownerName || authContext.user?.login === "admin") && <button onClick={() => handleEditQuizClick(quiz.id, index)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">EDIT</button>}
                  </td>
                </tr>

              ))}
            </tbody>
          </table>
        </div>

      ) : (
        <p>User not logged in</p>
      )}

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default QuizListComponent;