import React, { useState, useEffect } from 'react';
import './App.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import TriangleSVG from './svgs/TriangleSVG';
import SineWaveSVG from './svgs/SineWaveSVG';
import CosineWaveSVG from './svgs/CosineWaveSVG';
import TangentWaveSVG from './svgs/TangentWaveSVG';
import AngleSVG from './svgs/AngleSVG';

const topics = {
  Arithmetic: ['Addition', 'Subtraction', 'Multiplication', 'Division'],
  Geometry: ['Shapes', 'Area', 'Perimeter', 'Angles'],
  Fractions: ['Simplifying', 'Converting', 'Operations'],
  Algebra: ['Equations', 'Variables', 'Expressions'],
  Trigonometry: ['Sine', 'Cosine', 'Tangent']
};

const gradeTopicLimits = {
  2: ['Arithmetic'],
  3: ['Arithmetic'],
  4: ['Arithmetic', 'Fractions'],
  5: ['Arithmetic', 'Fractions'],
  6: ['Arithmetic', 'Fractions', 'Geometry'],
  7: ['Arithmetic', 'Fractions', 'Geometry', 'Algebra', 'Trigonometry'],
  8: ['Arithmetic', 'Fractions', 'Geometry', 'Algebra', 'Trigonometry']
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
    const allowedMainTopics = gradeTopicLimits[selectedGrade];
    const newState = {};
    Object.entries(topics).forEach(([mainTopic, subtopics]) => {
      const isMainTopicAllowed = allowedMainTopics.includes(mainTopic);
      subtopics.forEach(subtopic => {
        newState[subtopic] = isMainTopicAllowed;
      });
    });
    setEnabledTopics(newState);
    setDifficultyLevel(1);
    setCorrectCount(0);
    setIncorrectCount(0);
    localStorage.setItem('selectedGrade', selectedGrade);
  }, [selectedGrade]);

  useEffect(() => {
    localStorage.setItem('enabledTopics', JSON.stringify(enabledTopics));
    setProblem(generateProblem(enabledTopics));
  }, [enabledTopics]);

  const handleToggle = (topic) => {
    const updated = { ...enabledTopics, [topic]: !enabledTopics[topic] };
    const hasEnabled = Object.values(updated).some(v => v);
    if (!hasEnabled) return;
    setEnabledTopics(updated);
    localStorage.setItem('enabledTopics', JSON.stringify(updated));
    setProblem(generateProblem(updated));
  };

  const generateSingleProblem = (pick) => {
    let q = '', a = 0, hint = '', svg = null;
    const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    switch (pick) {
      case 'Addition': {
        const x = random(1, 50), y = random(1, 50);
        q = `What is ${x} + ${y}?`;
        a = x + y;
        hint = 'Add the two numbers.';
        break;
      }
      case 'Subtraction': {
        const x = random(10, 99), y = random(1, x);
        q = `What is ${x} - ${y}?`;
        a = x - y;
        hint = 'Subtract the second number from the first.';
        break;
      }
      case 'Multiplication': {
        const x = random(2, 12), y = random(2, 12);
        q = `What is ${x} × ${y}?`;
        a = x * y;
        hint = 'Multiply the numbers.';
        break;
      }
      case 'Division': {
        const y = random(2, 12), aTemp = random(2, 12);
        const x = y * aTemp;
        q = `What is ${x} ÷ ${y}?`;
        a = aTemp;
        hint = 'Divide the first number by the second.';
        break;
      }
      case 'Sine': {
        q = 'What is sin(90°)?';
        a = 1;
        hint = 'Think about the unit circle.';
        svg = <SineWaveSVG />;
        break;
      }
      case 'Cosine': {
        q = 'What is cos(0°)?';
        a = 1;
        hint = 'Think about the unit circle.';
        svg = <CosineWaveSVG />;
        break;
      }
      case 'Tangent': {
        q = 'What is tan(45°)?';
        a = 1;
        hint = 'Opposite over adjacent.';
        svg = <TangentWaveSVG />;
        break;
      }
      case 'Shapes': {
        q = 'Identify this shape.';
        a = 'triangle';
        hint = 'It has three sides.';
        svg = <TriangleSVG />;
        break;
      }
      case 'Angles': {
        q = 'How many degrees in a right angle?';
        a = 90;
        hint = 'It forms an L shape.';
        svg = <AngleSVG />;
        break;
      }
      default:
        return null;
    }
    return { question: q, correctAnswer: a, hint, svg };
  };

  const generateProblem = (topicState) => {
    const allEnabled = Object.entries(topicState).filter(([_, v]) => v).map(([k]) => k);
    if (allEnabled.length === 0) return { question: 'Enable topics to start!', correctAnswer: '', hint: '', svg: null };

    let problem = null;
    let tries = 0;
    while (!problem && tries < 10) {
      const pick = allEnabled[Math.floor(Math.random() * allEnabled.length)];
      problem = generateSingleProblem(pick);
      tries++;
    }
    return problem || { question: 'No valid problems available.', correctAnswer: '', hint: '', svg: null };
  };

  const checkAnswer = () => {
    if (!problem) return;
    const isCorrect = String(answer).trim().toLowerCase() === String(problem.correctAnswer).toLowerCase();
    if (isCorrect) {
      const newCorrect = correctCount + 1;
      const newLevel = Math.min(difficultyLevel + 1, getDifficultyCap(selectedGrade));
      const newBadges = newCorrect % 5 === 0 ? [...badges, '⭐'] : badges;
      setCorrectCount(newCorrect);
      setDifficultyLevel(newLevel);
      setBadges(newBadges);
      setFeedback('Correct!');
      setAnswer('');
      localStorage.setItem('badges', JSON.stringify(newBadges));
    } else {
      const newIncorrect = incorrectCount + 1;
      setIncorrectCount(newIncorrect);
      setDifficultyLevel(1);
      setFeedback(`Incorrect. Hint: ${problem.hint}`);
    }
    const next = generateProblem(enabledTopics);
    setProblem(next);
    localStorage.setItem('correctCount', correctCount + (isCorrect ? 1 : 0));
    localStorage.setItem('incorrectCount', incorrectCount + (isCorrect ? 0 : 1));
  };

  const chartData = [
    {
      topic: 'Arithmetic',
      total: correctCount + incorrectCount,
      correct: correctCount
    }
  ];

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="left-panel">
        <select value={selectedGrade} onChange={(e) => setSelectedGrade(Number(e.target.value))}>
          {[2,3,4,5,6,7,8].map(grade => <option key={grade} value={grade}>Grade {grade}</option>)}
        </select>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="/images/forest.jpg">Forest</option>
          <option value="/images/space.jpg">Space</option>
          <option value="/images/beach.jpg">Beach</option>
          <option value="/images/mountains.jpg">Mountains</option>
          <option value="/images/city.jpg">City</option>
          <option value="/images/classroom.jpg">Classroom</option>
        </select>
        {Object.entries(topics).map(([category, items]) => (
          <div key={category} className="topic-group">
            <strong>{category}</strong>
            {items.map(topic => (
              <label key={topic} className="topic-toggle">
                <input
                  type="checkbox"
                  checked={enabledTopics[topic] || false}
                  onChange={() => handleToggle(topic)}
                  disabled={!gradeTopicLimits[selectedGrade].includes(category)}
                />
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

      <div className="bottom-panel">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="topic" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="red" />
            <Bar dataKey="correct" fill="green" />
          </BarChart>
        </ResponsiveContainer>
        <div className="badges">
          {badges.map((badge, index) => <div key={index} className="badge">{badge}</div>)}
        </div>
      </div>
    </div>
  );
};

export default MathGameApp;
