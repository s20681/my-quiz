function NewQuestionForm() {

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const formData = {
  //     question: this.state.question,
  //     answerA: this.state.answerA,
  //     answerB: this.state.answerB,
  //     answerC: this.state.answerC,
  //     answerD: this.state.answerD,
  //     correctAnswer: this.state.correctAnswer,
  //   };
    
  //       // mode: 'cors', 
  //   // headers: { 'Content-Type': 'application/json' },
  //   // headers: { 'Content-Type': 'Question' },
  //   fetch('http://127.0.0.1:8080/in', {  // Enter your IP address here

  //   method: 'POST', 
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(formData) // body data type must match "Content-Type" header

  // })
  //   console.log(formData)
  // };

    return (
      <form id="myForm">
          <div>
              <textarea id="question" name="question" placeholder="Write the question here..." 
              onChange={(e) => this.setState({ question: e.target.value })}></textarea>
          </div>
  
          <div><input type="text" id="answerA" placeholder="Enter answer A" /></div>
          <div><input type="text" id="answerB" placeholder="Enter answer B" /></div>
          <div><input type="text" id="answerC" placeholder="Enter answer C" /></div>
          <div><input type="text" id="answerD" placeholder="Enter answer D" /></div>
          <div>
              <select id="selectCorrectAnswer" defaultValue={'None'}>
                  <option value="answerA">A</option>
                  <option value="answerB">B</option>
                  <option value="answerC">C</option>
                  <option value="answerD">D</option>
              </select>
          </div>
  
          <div>
              <button type="submit">Submit</button>
          </div>
      </form>
    );
}

export default NewQuestionForm;