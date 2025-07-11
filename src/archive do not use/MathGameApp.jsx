// CLEANED UP VERSION WITH 2ND & 3RD GRADE SUPPORT + QUIZ FORMAT + THEME SELECTOR + USER PROFILES + AVATARS + USER SCORE TRACKING + CHARTS + BADGES + ANALYTICS BY GRADE/DIFFICULTY + WEEKLY/MONTHLY SUMMARIES + STYLESHEET LAYOUT + COMPACT LAYOUT + TOGGLABLE CHART LEGENDS + DROPDOWN ON LOGIN
import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import "./App.css";

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
  const [theme, setTheme] = useState("");
  const [quizMode, setQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    if (theme) {
      document.body.style.backgroundImage = `url(${theme})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "center center";
    }
  }, [theme]);

  useEffect(() => {
    if (activeUser && !quizMode) {
      setProblem(generateProblem(grade, difficulty));
    }
  }, [activeUser, grade, difficulty, quizMode]);

  useEffect(() => {
    localStorage.setItem("mathUsers", JSON.stringify(users));
  }, [users]);

  function generateProblem(gradeLevel = "4", difficultyLevel = "easy") {
    // ...same as before...
  }

  function startQuiz() {
    const questions = Array.from({ length: 10 }, () => generateProblem(grade, difficulty));
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

          const updatedUsers = users.map((u) => {
            if (u.name === activeUser.name) {
              const history = u.quizHistory || [];
              const updatedHistory = [...history, { grade, difficulty, score, timestamp: new Date().toISOString() }];
              const badges = generateBadges(updatedHistory);
              const updatedUser = { ...u, quizHistory: updatedHistory, badges };
              setActiveUser(updatedUser);
              localStorage.setItem("activeMathUser", JSON.stringify(updatedUser));
              return updatedUser;
            }
            return u;
          });
          setUsers(updatedUsers);
        }
      }, 1000);
    }
  }

  function generateBadges(history) {
    const badges = [];
    const highScores = history.filter((q) => q.score >= 9);
    if (highScores.length >= 1) badges.push("⭐ High Score!");
    if (history.length >= 5) badges.push("🎯 Quiz Veteran");
    return badges;
  }

  function groupBy(array, keyFn) {
    return array.reduce((acc, item) => {
      const key = keyFn(item);
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});
  }

  return (
    <div className="layout compact">
      <header className="app-header">
        <h1>Math Game</h1>
        {activeUser && (
          <div className="user-info">
            <span>{activeUser.name}</span>
            {activeUser.avatar && <img src={activeUser.avatar} alt="avatar" width={40} />}
          </div>
        )}
        <div className="selectors">
          <select value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value="2">2nd Grade</option>
            <option value="3">3rd Grade</option>
            <option value="4">4th Grade</option>
            <option value="5">5th Grade</option>
            <option value="6">6th Grade</option>
            <option value="7">7th Grade</option>
            <option value="8">8th Grade</option>
          </select>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select onChange={(e) => setTheme(e.target.value)}>
            <option value="">Theme</option>
            <option value="/images/space.jpg">Space</option>
            <option value="/images/forest.jpg">Forest</option>
            <option value="/images/beach.jpg">Beach</option>
            <option value="/images/park.jpg">Park</option>
            <option value="/images/sky.jpg">Sky</option>
          </select>
        </div>
      </header>

      <main className="main-content">
        <section className="game-panel">
          {activeUser ? (
            // ...game section...
          ) : (
            <section className="login-panel">
              <input placeholder="Enter your name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
              <select onChange={(e) => setAvatarDataUrl(e.target.value)}>
                <option value="">Avatar</option>
                <option value="/avatars/avatar1.png">Avatar 1</option>
                <option value="/avatars/avatar2.png">Avatar 2</option>
                <option value="/avatars/avatar3.png">Avatar 3</option>
                <option value="/avatars/avatar4.png">Avatar 4</option>
              </select>
              <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                <option value="2">2nd Grade</option>
                <option value="3">3rd Grade</option>
                <option value="4">4th Grade</option>
                <option value="5">5th Grade</option>
                <option value="6">6th Grade</option>
                <option value="7">7th Grade</option>
                <option value="8">8th Grade</option>
              </select>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <button onClick={() => {
                const user = { name: newUserName, avatar: avatarDataUrl, quizHistory: [], badges: [] };
                setUsers([...users, user]);
                setActiveUser(user);
                localStorage.setItem("activeMathUser", JSON.stringify(user));
              }}>Start</button>
            </section>
          )}
        </section>

        {activeUser && (
          // ...history, analytics, summary, badges...
        )}
      </main>
    </div>
  );
}
