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
  const [selectedGrade, setSelectedGrade] = useState(() => Number(localStorage.getItem('selectedGrade')) || 2);
  const [enabledTopics, setEnabledTopics] = useState(() => JSON.parse(localStorage.getItem('enabledTopics')) || {});
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
    // Problem generation logic omitted for brevity
    return { question: "What is 2 + 2?", correctAnswer: 4, hint: "It’s more than 3.", svg: null };
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="left-panel">
        <select value={selectedGrade} onChange={(e) => setSelectedGrade(Number(e.target.value))}>
          {[2,3,4,5,6,7,8].map(grade => <option key={grade} value={grade}>Grade {grade}</option>)}
        </select>
        {Object.entries(topics).map(([category, items]) => (
          <div key={category} className="topic-group">
            <strong>{category}</strong>
            {items.map(topic => (
              <label key={topic} className="topic-toggle">
                <input type="checkbox" disabled={!gradeTopicLimits[selectedGrade].includes(topic)} checked={enabledTopics[topic]} onChange={() => handleToggle(topic)} />
                {topic}
              </label>
            ))}
          </div>
        ))}
      </div>

      <div className="center-panel">
        <motion.div className="question-block" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1>{problem?.question}</h1>
          {problem?.svg && <div className="svg-container">{problem.svg}</div>}
          <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && checkAnswer()} />
          <p className="hint">{feedback}</p>
        </motion.div>
      </div>

      <div className="right-panel">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={[{name: 'Correct', value: correctCount}, {name: 'Incorrect', value: incorrectCount}]}> 
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
        <div className="badges">
          {badges.map((badge, index) => <div key={index} className="badge">{badge}</div>)}
        </div>
      </div>
    </div>
  );
};

export default MathGameApp;
