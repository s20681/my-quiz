import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../User/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    const handleGoHome = () => {
        navigate(`/quiz/all`);
      };

    const handleManageAccount = () => {
        navigate(`/manage`);
    };

    const handleLogout = () => {
        authContext.logout();
        navigate(`/login`);
    };

    return (
        <nav>
            <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="#" className="flex items-center">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 mr-3" alt="Flowbite Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">QuizBIU</span>
                    </a>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                        <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                            <li>
                                <a href="#" onClick={() => handleGoHome()} className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent" aria-current="page">Quiz List</a>
                            </li>
                            <li>
                                <a href="#" onClick={() => handleManageAccount()} className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Manage Account</a>
                            </li>
                            <li>
                                <a href="#" onClick={() => handleLogout()} className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </nav>
    );
};

export default Navbar;