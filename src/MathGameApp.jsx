import React, { useState, useEffect } from 'react';
import './App.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import TriangleSVG from './svgs/TriangleSVG';
import SineWaveSVG from './svgs/SineWaveSVG';
import CosineWaveSVG from './svgs/CosineWaveSVG';
import TangentWaveSVG from './svgs/TangentWaveSVG';
import CircleSVG from './svgs/CircleSVG';
import AngleSVG from './svgs/AngleSVG';
import SquareSVG from './svgs/SquareSVG';

const topics = {
  Arithmetic: ['Addition', 'Subtraction', 'Multiplication', 'Division'],
  Geometry: ['Shapes', 'Area', 'Perimeter', 'Angles'],
  Fractions: ['Simplifying', 'Converting', 'Operations'],
  Algebra: ['Equations', 'Variables', 'Expressions'],
  Trigonometry: ['Sine', 'Cosine', 'Tangent']
};

const gradeTopicLimits = {
  2: ['Addition'],
  3: ['Addition', 'Subtraction', 'Multiplication'],
  4: ['Addition', 'Subtraction', 'Multiplication'],
  5: ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions'],
  6: ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Geometry'],
  7: ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Geometry', 'Algebra', 'Trigonometry'],
  8: ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Geometry', 'Algebra', 'Trigonometry']
};

const getDifficultyCap = (grade) => {
  if (grade === 2) return 1;
  if (grade === 3 || grade === 4) return 3;
  if (grade === 5 || grade === 6) return 6;
  return 7;
};

const MathGameApp = () => {
  const [selectedGrade, setSelectedGrade] = useState(() => {
    const savedGrade = localStorage.getItem('selectedGrade');
    return savedGrade ? Number(savedGrade) : 2;
  });
  const [enabledTopics, setEnabledTopics] = useState(() => {
    const savedTopics = localStorage.getItem('enabledTopics');
    return savedTopics ? JSON.parse(savedTopics) : {};
  });
  const [theme, setTheme] = useState('/images/forest.jpg');
  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [correctCount, setCorrectCount] = useState(() => Number(localStorage.getItem('correctCount')) || 0);
  const [incorrectCount, setIncorrectCount] = useState(() => Number(localStorage.getItem('incorrectCount')) || 0);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem('badges')) || []);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.style.backgroundImage = `url(${theme})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center center';
  }, [theme]);

  useEffect(() => {
    const allowedTopics = gradeTopicLimits[selectedGrade];
    const newState = {};
    Object.values(topics).flat().forEach(topic => {
      newState[topic] = allowedTopics.includes(topic);
    });
    setEnabledTopics(newState);
    setDifficultyLevel(1);
    setCorrectCount(0);
    setIncorrectCount(0);
    localStorage.setItem('selectedGrade', selectedGrade);
  }, [selectedGrade]);

  useEffect(() => {
    setProblem(generateProblem());
    localStorage.setItem('enabledTopics', JSON.stringify(enabledTopics));
  }, [enabledTopics]);

  const handleToggle = (topic) => {
    if (!gradeTopicLimits[selectedGrade].includes(topic)) return;
    setEnabledTopics(prev => ({ ...prev, [topic]: !prev[topic] }));
  };

  const generateProblem = () => {
    const level = difficultyLevel;
    const grade = selectedGrade;
    const topicsArray = Object.keys(enabledTopics).filter(t => enabledTopics[t]);

    if (topicsArray.includes('Equations') && level >= 7) {
      const a = Math.floor(Math.random() * 10 + 1);
      const x = Math.floor(Math.random() * 10);
      const b = Math.floor(Math.random() * 10);
      return { question: `${a}x + ${b} = ${a * x + b}. Solve for x`, correctAnswer: x, hint: 'Isolate x by undoing operations', svg: null };
    }

    if (topicsArray.includes('Sine') && level >= 7) {
      return { question: 'What is sin(30°)?', correctAnswer: 0.5, hint: 'Use the unit circle or a trig table', svg: <SineWaveSVG /> };
    }

    if (topicsArray.includes('Cosine') && level >= 7) {
      return { question: 'What is cos(0°)?', correctAnswer: 1, hint: 'Look at the cosine on the unit circle', svg: <CosineWaveSVG /> };
    }

    if (topicsArray.includes('Tangent') && level >= 7) {
      return { question: 'What is tan(45°)?', correctAnswer: 1, hint: 'Opposite over adjacent in a right triangle', svg: <TangentWaveSVG /> };
    }

    if (topicsArray.includes('Shapes') && level >= 4) {
      return { question: 'What is the sum of angles in a triangle?', correctAnswer: 180, hint: 'It’s always the same for any triangle', svg: <TriangleSVG /> };
    }

    if (topicsArray.includes('Angles') && level >= 4) {
      return { question: 'How many degrees in a right angle?', correctAnswer: 90, hint: 'A quarter turn', svg: <AngleSVG /> };
    }

    if (topicsArray.includes('Addition') && level >= 1) {
      const a = Math.floor(Math.random() * 10 + 1);
      const b = Math.floor(Math.random() * 10 + 1);
      return { question: `${a} + ${b}`, correctAnswer: a + b, hint: `Start at ${a} and count up ${b}`, svg: null };
    }

    return { question: 'What is 2 + 2?', correctAnswer: 4, hint: 'It’s more than 3.', svg: null };
  };

  const handleSubmit = () => {
    if (!problem) return;
    const isCorrect = parseFloat(answer) === problem.correctAnswer;
    if (isCorrect) {
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      setIncorrectCount(0);
      setFeedback('✅ Correct!');
      setDifficultyLevel(prev => Math.min(prev + 1, getDifficultyCap(selectedGrade)));
      updateBadges(newCorrect);
    } else {
      setIncorrectCount(prev => prev + 1);
      setCorrectCount(0);
      setFeedback('❌ Incorrect');
      setDifficultyLevel(1);
    }
    setAnswer('');
    setTimeout(() => {
      const newProblem = generateProblem();
      setProblem(newProblem);
      setFeedback('');
      localStorage.setItem('correctCount', correctCount);
      localStorage.setItem('incorrectCount', incorrectCount);
      localStorage.setItem('badges', JSON.stringify(badges));
    }, 1000);
  };

  const updateBadges = (count) => {
    const newBadges = [];
    if (count >= 10 && count < 50) {
      const streaks = Math.floor(count / 10);
      for (let i = 1; i <= streaks; i++) {
        newBadges.push(`⭐ ${i * 10}-Streak`);
      }
    } else if (count >= 50 && count < 200) {
      const milestones = Math.floor((count - 50) / 25);
      for (let i = 0; i <= milestones; i++) {
        newBadges.push(`🦄 ${50 + i * 25} Correct!`);
      }
    } else if (count >= 200) {
      const expertLevels = Math.floor((count - 200) / 50);
      for (let i = 0; i <= expertLevels; i++) {
        newBadges.push(`🦄✨ ${200 + i * 50}+ Expert`);
      }
    }
    setBadges(newBadges);
  };

  return (
    <div className={`app-wrapper ${darkMode ? 'dark' : ''}`}>
      <header className="app-header">
        <h1>Math Game</h1>
        <div className="selectors">
          <select value={selectedGrade} onChange={(e) => setSelectedGrade(Number(e.target.value))}>
            {[2, 3, 4, 5, 6, 7, 8].map(grade => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="/images/space.jpg">Space</option>
            <option value="/images/forest.jpg">Forest</option>
            <option value="/images/beach.jpg">Beach</option>
          </select>
          <label>
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} /> Dark Mode
          </label>
        </div>
      </header>

      <main className="topic-selector">
        {Object.entries(topics).map(([category, topicList]) => (
          <div className="topic-group" key={category}>
            <h4>{category}</h4>
            <div className="toggle-container">
              {topicList.map(topic => (
                <button
                  key={topic}
                  className={`toggle-btn ${enabledTopics[topic] ? 'active' : ''}`}
                  onClick={() => handleToggle(topic)}
                  disabled={!gradeTopicLimits[selectedGrade].includes(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        ))}

        {problem && (
          <motion.div
            className="question-block"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', padding: '20px', borderRadius: '12px' }}
          >
            <p className="question-text" style={{ color: '#fff', fontSize: '2rem' }}>{problem.question}</p>
            {problem.svg && <div className="visual-aid">{problem.svg}</div>}
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button onClick={handleSubmit}>Submit</button>
            {feedback && <p className="feedback-text">{feedback}</p>}
            <p>Correct: {correctCount} | Incorrect: {incorrectCount}</p>
            <div className="badges-container">
              {badges.map((b, i) => <span key={i} className="badge-item">{b}</span>)}
            </div>
          </motion.div>
        )}

        <section className="analytics-section">
          <h2>Performance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={[{ name: 'Q1', score: 7 }, { name: 'Q2', score: 9 }]}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#e75480" strokeWidth={4} name="Performance" />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </main>
    </div>
  );
};

export default MathGameApp;
