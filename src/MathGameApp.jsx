// CLEANED UP VERSION WITH 2ND & 3RD GRADE SUPPORT
import { useState, useEffect } from "react";

export default function MathGameApp() {
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem("mathUsers")) || []);
  const [activeUser, setActiveUser] = useState(() => JSON.parse(localStorage.getItem("activeMathUser")) || null);
  const [grade, setGrade] = useState("4");
  const [difficulty, setDifficulty] = useState("easy");
  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [avatarDataUrl, setAvatarDataUrl] = useState(null);

  useEffect(() => {
    if (activeUser) {
      setProblem(generateProblem(grade, difficulty));
    }
  }, [activeUser, grade, difficulty]);

  useEffect(() => {
    localStorage.setItem("mathUsers", JSON.stringify(users));
  }, [users]);

  function generateProblem(gradeLevel = "4", difficultyLevel = "easy") {
    let types = [];

    if (gradeLevel === "2" || gradeLevel === "3") {
      types = ["addition", "subtraction"];
    } else {
      types = ["multiplication", "division", "fraction", "word"];
      if (gradeLevel === "7" || gradeLevel === "8") {
        types.push("algebra");
      }
    }

    const type = types[Math.floor(Math.random() * types.length)];
    let a = Math.floor(Math.random() * 10) + 1;
    let b = Math.floor(Math.random() * 10) + 1;
    let question = "";
    let correctAnswer = 0;
    let hint = "";

    if (gradeLevel === "6") { a += 10; b += 10; }
    if (gradeLevel === "7") { a += 20; b += 20; }
    if (gradeLevel === "8") { a += 30; b += 30; }
    if (gradeLevel === "3") { a = Math.floor(Math.random() * 10) + 1; b = Math.floor(Math.random() * 10) + 1; }
    if (gradeLevel === "2") { a = Math.floor(Math.random() * 5) + 1; b = Math.floor(Math.random() * 5) + 1; }

    switch (type) {
      case "addition":
        correctAnswer = a + b;
        question = `What is ${a} + ${b}?`;
        hint = `Add ${a} and ${b}.`;
        break;
      case "subtraction":
        [a, b] = a > b ? [a, b] : [b, a];
        correctAnswer = a - b;
        question = `What is ${a} - ${b}?`;
        hint = `Subtract ${b} from ${a}.`;
        break;
      case "multiplication":
        if (difficultyLevel === "hard") { a += 10; b += 10; }
        question = `What is ${a} x ${b}?`;
        correctAnswer = a * b;
        hint = `Multiply ${a} by ${b} step by step.`;
        break;
      case "division":
        if (difficultyLevel === "hard") { a += 10; b += 5; }
        correctAnswer = a;
        question = `What is ${a * b} ÷ ${b}?`;
        hint = `Think: what number times ${b} gives ${a * b}?`;
        break;
      case "fraction":
        a = Math.floor(Math.random() * 3) + 1;
        b = a * 2;
        correctAnswer = parseFloat((a / b).toFixed(2));
        question = `What is ${a}/${b} as a decimal?`;
        hint = `Divide ${a} by ${b}.`;
        break;
      case "word":
        a = Math.floor(Math.random() * 5) + 2;
        b = Math.floor(Math.random() * 5) + 2;
        correctAnswer = a * b;
        question = `There are ${a} shelves with ${b} books each. How many books in total?`;
        hint = `Multiply number of shelves by number of books per shelf.`;
        break;
      case "algebra":
        let x = Math.floor(Math.random() * 10) + 1;
        let form = Math.random() < 0.5 ? 1 : 2;
        if (form === 1) {
          correctAnswer = x;
          question = `Solve for x: x + ${x} = ${x + x}`;
          hint = `Subtract ${x} from both sides.`;
        } else {
          correctAnswer = x;
          question = `Solve for x: 2x = ${2 * x}`;
          hint = `Divide both sides by 2.`;
        }
        break;
    }

    return { question, correctAnswer, hint, type };
  }

  return (
    <div>
      <h1>Welcome to the Math Game</h1>
      {activeUser ? (
        <>
          <p>{problem?.question}</p>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            onClick={() => {
              if (parseFloat(answer) === problem.correctAnswer) {
                setFeedback("Correct!");
              } else {
                setFeedback("Try again!");
              }
            }}
          >
            Submit
          </button>
          <p>{feedback}</p>
          {showHint && <p>Hint: {problem.hint}</p>}
          <button onClick={() => setShowHint(true)}>Show Hint</button>
        </>
      ) : (
        <>
          <input
            placeholder="Enter your name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
          <button
            onClick={() => {
              const user = { name: newUserName };
              setUsers([...users, user]);
              setActiveUser(user);
              localStorage.setItem("activeMathUser", JSON.stringify(user));
            }}
          >
            Start Game
          </button>
        </>
      )}
    </div>
  );
}
