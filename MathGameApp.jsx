// SIMPLIFIED TEST LAYOUT FOR DEBUGGING UI VISIBILITY ISSUES WITH DIFFICULTY SCALING
import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import "./App.css";

export default function MathGameApp() {
  const [grade, setGrade] = useState("4");
  const [difficulty, setDifficulty] = useState("easy");
  const [difficultyLevel, setDifficultyLevel] = useState(1); // numeric difficulty level for scaling
  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [theme, setTheme] = useState("/images/forest.jpg");
  const [quizMode, setQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showLineA, setShowLineA] = useState(true);

  const activeUser = {
    name: "TestUser",
    avatar: "/avatars/avatar1.png",
    quizHistory: [],
    badges: []
  };

  useEffect(() => {
    if (theme) {
      document.body.style.backgroundImage = `url(${theme})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "center center";
    }
  }, [theme]);

  useEffect(() => {
    if (!quizMode) {
      setProblem(generateProblem(difficultyLevel));
    }
  }, [grade, difficultyLevel, quizMode]);

  function generateProblem(level = 1) {
    const maxVal = 10 + level * 2;
    const a = Math.floor(Math.random() * maxVal + 1);
    const b = Math.floor(Math.random() * maxVal + 1);
    return {
      question: `${a} + ${b}`,
      correctAnswer: a + b,
      hint: `Try counting on from ${a}`
    };
  }

  function startQuiz() {
    const questions = Array.from({ length: 10 }, () => generateProblem(difficultyLevel));
    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    setQuizMode(true);
    setProblem(questions[0]);
  }

  function handleSubmitAnswer() {
    const current = quizMode ? quizQuestions[currentQuestionIndex] : problem;
    if (parseFloat(answer) === current.correctAnswer) {
      setFeedback("Correct!");
      setDifficultyLevel(prev => Math.min(prev + 1, 10));
      if (quizMode) setScore(score + 1);
    } else {
      setFeedback("Try again!");
    }

    if (quizMode) {
      setTimeout(() => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          setProblem(quizQuestions[nextIndex]);
          setAnswer("");
          setFeedback("");
          setShowHint(false);
        } else {
          setQuizFinished(true);
          setQuizMode(false);
        }
      }, 1000);
    }
  }

  return (
    <div className="layout compact">
      <header className="app-header">
        <h1>Math Game - Test Layout</h1>
        <div className="user-info">
          <span>{activeUser.name}</span>
          <img src={activeUser.avatar} alt="avatar" width={40} />
        </div>
        <div className="selectors">
          <select value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value="2">2nd Grade</option>
            <option value="3">3rd Grade</option>
            <option value="4">4th Grade</option>
          </select>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="/images/space.jpg">Space</option>
            <option value="/images/forest.jpg">Forest</option>
            <option value="/images/beach.jpg">Beach</option>
          </select>
        </div>
      </header>

      <main className="main-content">
        <section className="game-panel">
          <div className="game-section">
            {!quizFinished ? (
              <>
                <p><strong>Question:</strong> {problem?.question}</p>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your answer"
                />
                <button onClick={handleSubmitAnswer}>Submit</button>
                <button onClick={() => setShowHint(true)}>Hint</button>
                <button onClick={startQuiz}>Start Quiz</button>
                {showHint && <p className="hint">Hint: {problem?.hint}</p>}
                <p className="feedback">{feedback}</p>
              </>
            ) : (
              <p className="final-score">You scored {score} out of 10!</p>
            )}
          </div>
        </section>

        <section className="analytics-section">
          <h2>Test Graph</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={[{ name: "Q1", score: 7 }, { name: "Q2", score: 9 }]}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend onClick={() => setShowLineA(!showLineA)} />
              {showLineA && <Line type="monotone" dataKey="score" stroke="#8884d8" />}
            </LineChart>
          </ResponsiveContainer>
        </section>
      </main>
    </div>
  );
}
