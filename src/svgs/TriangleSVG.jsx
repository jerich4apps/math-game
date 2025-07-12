import React from 'react';

const TriangleSVG = () => (
  <svg width="150" height="130" viewBox="0 0 150 130">
    <polygon points="10,120 140,120 75,20" stroke="black" strokeWidth="2" fill="lightblue" />
    <text x="70" y="125" fontSize="12" textAnchor="middle">Base</text>
    <text x="80" y="40" fontSize="12">Height</text>
  </svg>
);

export default TriangleSVG;
