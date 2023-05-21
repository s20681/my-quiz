import { useNavigate } from 'react-router-dom'
import React, { ChangeEvent, useState } from 'react';

const QuizListComponent: React.FC = () => {
    const mockedData = [ { "id" : 1, "name" : "quiz1", "description" : "blabla animals", "category" : "xdd", "difficulty" : "MEDIUM", "ownerName" : "defaultusername", "questions" : [ { "id" : 1, "content" : "animals question", "correctAnswerIndex" : 2, "questionType" : "SINGLE_CHOICE", "answers" : [ { "id" : 3, "content" : "akndsand", "correct" : false }, { "id" : 4, "content" : "iadasodusad", "correct" : false }, { "id" : 5, "content" : "d09usa09dsa09d", "correct" : true }, { "id" : 6, "content" : "d09sada", "correct" : false } ] } ] }, 
    { "id" : 2, "name" : "quiz2", "description" : "blabla history", "category" : "history", "difficulty" : "HIGH", "ownerName" : "defaultusername", "questions" : [ ] }, ]

    return (
        <div>
            <ul>
            {mockedData.map((quiz, index) => {                  
           return (<li key={index}> Name: {quiz.name} Category: {quiz.category} Description: {quiz.description} Difficulty: {quiz.difficulty} Owner: {quiz.ownerName}</li>) 
        })
            }</ul>
        </div>
    );
}

export default QuizListComponent;