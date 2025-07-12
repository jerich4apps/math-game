import React from 'react';

const SineWaveSVG = () => (
  <svg width="200" height="100" viewBox="0 0 200 100">
    <path d="M0,50 Q25,0 50,50 T100,50 T150,50 T200,50"
          fill="none" stroke="purple" strokeWidth="2" />
    <line x1="0" y1="50" x2="200" y2="50" stroke="gray" strokeDasharray="5,5" />
    <text x="90" y="15" fontSize="12">Sine Wave</text>
  </svg>
);

export default SineWaveSVG;
