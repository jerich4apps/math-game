import React from 'react';

const CircleSVG = () => (
  <svg width="150" height="150" viewBox="0 0 150 150">
    <circle cx="75" cy="75" r="50" stroke="blue" strokeWidth="2" fill="lightblue" />
    <line x1="75" y1="75" x2="125" y2="75" stroke="darkblue" strokeWidth="2" />
    <text x="80" y="70" fontSize="12">Radius</text>
  </svg>
);

export default CircleSVG;
