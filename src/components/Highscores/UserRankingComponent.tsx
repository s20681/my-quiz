import React, { useEffect, useState } from 'react';
import { Ranking } from '../../interfaces';
import Navbar from '../Layout/NavbarComponent';

const UserRanking: React.FC = () => {
  const [ranking, setRanking] = useState<Ranking[]>();
  const [responseMessage, setResponseMessage] = useState('');

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
          let dataSorted = data.sort((a : Ranking, b : Ranking) => {    
            return (b.totalPoints - a.totalPoints);
        });
          setRanking(dataSorted);
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
    <div>
      <Navbar></Navbar>
      <div>
        <ul>

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Username
                </th>
                <th scope="col" className="px-6 py-3">
                  Total points
                </th>
                <th scope="col" className="px-6 py-3">
                  Total quizzes solved
                </th>
                <th scope="col" className="px-6 py-3">
                  Easy
                </th>
                <th scope="col" className="px-6 py-3">
                  Medium
                </th>
                <th scope="col" className="px-6 py-3">
                  Hard
                </th>
              </tr>
            </thead>
            <tbody>
            {ranking?.map((rank, index) => (
                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {rank.userName}
                  </th>
                  <td className="px-6 py-4">
                  {rank.totalPoints}
                  </td>
                  <td className="px-6 py-4">
                  {rank.totalQuizzes}
                  </td>
                  <td className="px-6 py-4">
                  {rank.totalEasyQuizzes}
                  </td>
                  <td className="px-6 py-4">
                  {rank.totalMediumQuizzes}
                  </td>
                  <td className="px-6 py-4">
                  {rank.totalHardQuizzes}
                  </td>
                </tr>

              ))}
            </tbody>
          </table>
        </ul>

        {responseMessage && <p>{responseMessage}</p>}
      </div>
    </div>
  );
};

export default UserRanking;