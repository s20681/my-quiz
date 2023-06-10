import React, { ChangeEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Question } from '../../interfaces';
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

const QuestionEdit: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [question, setSelectedQuestion] = useState<Question>()
    const [formState, setFormState] = useState<FormState>(initialData);

    useEffect(() => {
        if (location.state) {
            setSelectedQuestion(location.state as Question)
            const { content, answers, correctAnswerIndex } = location.state as Question;
            setFormState({
                question: content,
                answerA: answers[0]?.content || '',
                answerB: answers[1]?.content || '',
                answerC: answers[2]?.content || '',
                answerD: answers[3]?.content || '',
                correctAnswer: correctAnswerIndex.toString()
            });
        }
    }, [location.state]);
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
        const { name, value } = event.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        location.state.answers[0].content = formState.answerA
        location.state.answers[1].content = formState.answerB
        location.state.answers[2].content = formState.answerC
        location.state.answers[3].content = formState.answerD

        event.preventDefault();
        const formData = {
            questionID: question?.id,
            type: "SINGLE_CHOICE",
            content: formState.question,
            answers: [
                location.state.answers[0],
                location.state.answers[1],
                location.state.answers[2],
                location.state.answers[3],
            ],
            correctAnswerIndex: formState.correctAnswer,
        };

        fetch('http://127.0.0.1:8080/question/update', {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)

        }).then((response) => {
            if (response.ok) {
                handleGoBack();
            }
        })
    };

    const handleGoBack = () => {
        navigate(`/quiz/edit/${location.state.quizId}`, { state: { id: location.state.quizId } });
    };

    return (
        <div className="flex flex-col items-center">
            <Navbar></Navbar>
            <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
                <form id="myForm" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <textarea
                            id="question"
                            name="question"
                            value={formState.question}
                            placeholder="Write the question here..."
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="answerA"
                            value={formState.answerA}
                            id="answerA"
                            placeholder="Enter answer A"
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="answerB"
                            value={formState.answerB}
                            placeholder="Enter answer B"
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="answerC"
                            value={formState.answerC}
                            placeholder="Enter answer C"
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="answerD"
                            value={formState.answerD}
                            placeholder="Enter answer D"
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <select
                            id="selectCorrectAnswer"
                            name="correctAnswer"
                            value={formState.correctAnswer}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="0">A</option>
                            <option value="1">B</option>
                            <option value="2">C</option>
                            <option value="3">D</option>
                        </select>
                    </div>
                    <div>
                        <button
                            className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                <div>
                    <button
                        className="w-full bg-gray-300 text-gray-700 rounded-md py-2 mt-4 hover:bg-gray-400"
                        onClick={() => handleGoBack()}
                    >
                        Go back
                    </button>
                </div>
            </div>
        </div>

    );
}

export default QuestionEdit;