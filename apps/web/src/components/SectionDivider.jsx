
import React from 'react';

function SectionDivider({ className = '' }) {
  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
    </div>
  );
}

export default SectionDivider;
