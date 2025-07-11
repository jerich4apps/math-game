// SIMPLIFIED TEST LAYOUT FOR DEBUGGING UI VISIBILITY ISSUES WITH DIFFICULTY SCALING
import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import { motion } from "framer-motion";
import "./App.css";

export default function MathGameApp() {
  const [grade, setGrade] = useState("4");
  const [difficulty, setDifficulty] = useState("easy");
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [badges, setBadges] = useState([]);
  const [theme, setTheme] = useState("/images/forest.jpg");
  const [quizMode, setQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showLineA, setShowLineA] = useState(true);
  const [showHint, setShowHint] = useState(false);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSubmitAnswer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answer]);

  function generateProblem(level = 1) {
    const gradeNum = parseInt(grade);

    if (gradeNum >= 7 && level >= 5) {
      const a = Math.floor(Math.random() * 10 + 1);
      const b = Math.floor(Math.random() * 10 + 1);
      return {
        question: `${a}x + ${b} = ${a * 5 + b}. Solve for x`,
        correctAnswer: 5,
        hint: `Think of how to isolate x`
      };
    }

    const maxVal = 10 + level * 2 + (gradeNum - 2) * 5;
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

  function updateBadges(newCorrect) {
    const allBadges = [];
    if (newCorrect >= 10 && newCorrect < 50) {
      const streaks = Math.floor(newCorrect / 10);
      for (let i = 1; i <= streaks; i++) {
        allBadges.push(`⭐ ${i * 10}-Streak`);
      }
    } else if (newCorrect >= 50 && newCorrect < 200) {
      const milestones = Math.floor((newCorrect - 50) / 25);
      for (let i = 0; i <= milestones; i++) {
        allBadges.push(`🦄 ${50 + i * 25} Correct!`);
      }
    } else if (newCorrect >= 200) {
      const expertLevels = Math.floor((newCorrect - 200) / 50);
      for (let i = 0; i <= expertLevels; i++) {
        allBadges.push(`🦄✨ ${200 + i * 50}+ Expert`);
      }
    }
    setBadges(allBadges);
  }

  function handleSubmitAnswer() {
    const current = quizMode ? quizQuestions[currentQuestionIndex] : problem;
    if (parseFloat(answer) === current.correctAnswer) {
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      setIncorrectCount(0);
      updateBadges(newCorrect);
      setFeedback("Correct!");
      setDifficultyLevel(prev => Math.min(prev + 1, 10));
      setAnswer("");
      if (quizMode) setScore(score + 1);
    } else {
      setIncorrectCount(prev => prev + 1);
      setCorrectCount(0);
      setFeedback("Try again!");
      setDifficultyLevel(1);
    }

    if (quizMode) {
      setTimeout(() => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          setProblem(quizQuestions[nextIndex]);
          setAnswer("");
          setFeedback("");
        } else {
          setQuizFinished(true);
          setQuizMode(false);
        }
      }, 1000);
    }
  }

  function handleGradeChange(newGrade) {
    setGrade(newGrade);
    setDifficultyLevel(1);
    if (!quizMode) {
      setProblem(generateProblem(1));
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
          <select value={grade} onChange={(e) => handleGradeChange(e.target.value)}>
            <option value="2">2nd Grade</option>
            <option value="3">3rd Grade</option>
            <option value="4">4th Grade</option>
            <option value="5">5th Grade</option>
            <option value="6">6th Grade</option>
            <option value="7">7th Grade</option>
            <option value="8">8th Grade</option>
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
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.65)",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                    margin: "30px auto",
                    maxWidth: "80%",
                  }}
                >
                  <p style={{ fontSize: "3rem", color: "#ffffff" }}>
                    <strong>Question:</strong> {problem?.question}
                  </p>
                </motion.div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    style={{ fontSize: "1.5rem", padding: "10px", width: "200px" }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
                  <button onClick={handleSubmitAnswer}>Submit</button>
                  <button onClick={() => setShowHint(true)}>Hint</button>
                  <button onClick={startQuiz}>Skip</button>
                </div>
                {showHint && <p className="hint">Hint: {problem?.hint}</p>}
                <p className="feedback">{feedback}</p>
                <p style={{ textAlign: "center" }}>
                  Correct: {correctCount} | Incorrect: {incorrectCount}
                </p>
                {badges.length > 0 && (
                  <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <strong>Badges:</strong>
                    <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "5px" }}>
                      {badges.map((badge, idx) => (
                        <span key={idx} style={{ padding: "5px 10px", backgroundColor: "#ffe0f0", borderRadius: "12px", fontWeight: "bold" }}>{badge}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="final-score">You scored {score} out of 10!</p>
            )}
          </div>
        </section>

        <section className="analytics-section" style={{ width: "33%" }}>
          <h2>Test Graph</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={[{ name: "Q1", score: 7 }, { name: "Q2", score: 9 }]}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend onClick={() => setShowLineA(!showLineA)} />
              {showLineA && (
                <Line type="monotone" dataKey="score" stroke="#e75480" strokeWidth={4} name="Performance" />
              )}
            </LineChart>
          </ResponsiveContainer>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <strong>Correct:</strong> {correctCount} <br />
            <strong>Incorrect:</strong> {incorrectCount}
          </div>
        </section>
      </main>
    </div>
  );
}
