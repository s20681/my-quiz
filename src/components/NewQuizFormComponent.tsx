import React, { ChangeEvent, useState } from 'react';

interface FormState {
    name: string,
    description: string,//Few words about the quiz
    category: string,   // Animals, History etc. if user inputs a non existent category name it will create one
    difficulty: string, // high, medium, low
  }

const NewQuizForm: React.FC = () => {
    const [formState, setFormState] = useState<FormState>({
        name: '',
        description: '',
        category: '',
        difficulty: ''
      });

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
            name: formState.name,
            description: formState.description,
            category: formState.category,
            difficulty: formState.difficulty,
            owner: 'defaultusername' // TODO: change to current user name
        };

        // mode: 'cors', 
        // headers: { 'Content-Type': 'application/json' },
        // headers: { 'Content-Type': 'Question' },
        fetch('http://127.0.0.1:8080/quiz/new', {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData) // body data type must match "Content-Type" header

        })
        console.log(formData)
    };

    return (
        <form id="myForm" onSubmit={handleSubmit}>
            <div><input type="text" value={formState.name} id="name" name="name" placeholder="Enter the name of the quiz" onChange={handleChange}/></div>
            
            <div>
                <textarea id="quizName" name="description" value={formState.description} placeholder="Write brief quiz description here..."
                    onChange={handleChange}></textarea>
            </div>

            <div><input type="text" value={formState.category} name="category" id="category" placeholder="Enter quiz category name" onChange={handleChange}/></div>

            <div>
                <select id="difficulty" name="difficulty" value={formState.difficulty} onChange={handleChange}>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>
            </div>

            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    );
}

export default NewQuizForm;