import React, { ChangeEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
        console.log("Creating new question for quiz :" + quizId);
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
        console.log('Form submitted:', formState);
        const formData = {
            quizID: quizId, //TODO: add quiz id here,
            type: "SINGLE_CHOICE",
            content: formState.question,
            answers: [
                formState.answerA,
                formState.answerB,
                formState.answerC,
                formState.answerD
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
        console.log(formData)
        setFormState(initialData)
    };

    const handleGoBack = () => {
        navigate(`/quiz/edit/${location.state.id}`, { state: location.state });
    };

    return (
        <div>
            <p>Adding question for quiz id: {quizId}</p>
            <form id="myForm" onSubmit={handleSubmit}>
                <div>
                    <textarea id="question" name="question" value={formState.question} placeholder="Write the question here..."
                        onChange={handleChange}></textarea>
                </div>

                <div><input type="text" value={formState.answerA} name="answerA" id="answerA" placeholder="Enter answer A" onChange={handleChange} /></div>
                <div><input type="text" value={formState.answerB} name="answerB" placeholder="Enter answer B" onChange={handleChange} /></div>
                <div><input type="text" value={formState.answerC} name="answerC" placeholder="Enter answer C" onChange={handleChange} /></div>
                <div><input type="text" value={formState.answerD} name="answerD" placeholder="Enter answer D" onChange={handleChange} /></div>
                <div>
                    <select id="selectCorrectAnswer" name="correctAnswer" value={formState.correctAnswer} onChange={handleChange}>
                        <option value="0">A</option>
                        <option value="1">B</option>
                        <option value="2">C</option>
                        <option value="3">D</option>
                    </select>
                </div>

                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>

            <div>
                <button onClick={() => handleGoBack()}> Go back </button>
            </div>

        </div>
    );
}

export default NewQuestionForm;