import React, { ChangeEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Layout/NavbarComponent';

interface FormState {
    question: string,
    answerA: string,
    answerB: string,
    answerC: string,
    answerD: string,
    correctAnswer: string,
}

const initialData = {
    question: '',
    answerA: '',
    answerB: '',
    answerC: '',
    answerD: '',
    correctAnswer: ''
}

const NewQuestionForm: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [quizId, setSelectedQuizID] = useState(null)
    const [formState, setFormState] = useState<FormState>(initialData);

    useEffect(() => {
        // Fetch the selected quiz data based on the quiz ID or any other identifier
        // For simplicity, we'll set it to the first quiz in mockedData
        setSelectedQuizID(location.state.id);
    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
        const { name, value } = event.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = {
            quizID: quizId, //TODO: add quiz id here,
            type: "SINGLE_CHOICE",
            content: formState.question,
            answers: [
                { id: null, content: formState.answerA, isCorrect: false },
                { id: null, content: formState.answerB, isCorrect: false },
                { id: null, content: formState.answerC, isCorrect: false },
                { id: null, content: formState.answerD, isCorrect: false },
            ],
            correctAnswerIndex: formState.correctAnswer,
        };

        // mode: 'cors', 
        // headers: { 'Content-Type': 'application/json' },
        // headers: { 'Content-Type': 'Question' },
        fetch('http://127.0.0.1:8080/question/new', {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData) // body data type must match "Content-Type" header

        })
        setFormState(initialData)
    };

    const handleGoBack = () => {
        navigate(`/quiz/edit/${location.state.id}`, { state: location.state });
    };

    return (
        <div>
            <div className="flex flex-col items-center">
                <Navbar />

                <div className="max-w-md bg-white rounded-lg p-8 shadow-lg mt-8 min-w-[50%]">
                    <form id="myForm" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <textarea
                                id="question"
                                name="question"
                                value={formState.question}
                                placeholder="Write the question here..."
                                autoComplete='off'
                                onChange={handleChange}
                                required
                                className="border border-gray-300 px-4 py-2 rounded w-full"
                            ></textarea>
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                value={formState.answerA}
                                name="answerA"
                                id="answerA"
                                placeholder="Enter answer A"
                                autoComplete='off'
                                onChange={handleChange}
                                required
                                className="border border-gray-300 px-4 py-2 rounded w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                value={formState.answerB}
                                name="answerB"
                                placeholder="Enter answer B"
                                autoComplete='off'
                                onChange={handleChange}
                                required
                                className="border border-gray-300 px-4 py-2 rounded w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                value={formState.answerC}
                                name="answerC"
                                placeholder="Enter answer C"
                                autoComplete='off'
                                onChange={handleChange}
                                required
                                className="border border-gray-300 px-4 py-2 rounded w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                value={formState.answerD}
                                name="answerD"
                                placeholder="Enter answer D"
                                autoComplete='off'
                                onChange={handleChange}
                                required
                                className="border border-gray-300 px-4 py-2 rounded w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <select
                                id="selectCorrectAnswer"
                                name="correctAnswer"
                                value={formState.correctAnswer}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 px-4 py-2 rounded w-full"
                            >
                                <option value="0">A</option>
                                <option value="1">B</option>
                                <option value="2">C</option>
                                <option value="3">D</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <button className="accent-button w-full" type="submit">Submit</button>
                        </div>
                    </form>

                    <div className="mb-4">
                        <button className="regular-button w-full" onClick={() => handleGoBack()}>Go back</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewQuestionForm;