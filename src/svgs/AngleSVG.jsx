import React from 'react';

const AngleSVG = () => (
  <svg width="150" height="150" viewBox="0 0 150 150">
    <line x1="30" y1="120" x2="120" y2="120" stroke="black" strokeWidth="2" />
    <line x1="30" y1="120" x2="70" y2="60" stroke="black" strokeWidth="2" />
    <path d="M45 115 A20 20 0 0 1 65 105" fill="none" stroke="red" strokeWidth="2" />
    <text x="55" y="110" fontSize="12" fill="red">θ</text>
  </svg>
);

export default AngleSVG;
