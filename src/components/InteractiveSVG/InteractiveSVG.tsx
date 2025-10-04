import React from 'react';

interface InteractiveSVGProps {
  children: React.ReactNode;
  svgRef: React.RefObject<SVGSVGElement>;
  x: number;
  y: number;
  imageUrl: string;
  frameKey: string;
}

export const InteractiveSVG: React.FC<InteractiveSVGProps> = ({ frameKey, children, svgRef, x, y, imageUrl }) => {
  const style: { [key: string]: string } = {
    backgroundImage: imageUrl ? `url(${imageUrl})` : '',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    margin: '0 auto',
  }

  if (x) {
    style.width = `${x}px`;
  }
  if (y) {
    style.height = `${y}px`;
  }
  
  return (
    <svg
      style={style}
      ref={svgRef}
    >
      <defs>
    <pattern 
      id={frameKey}
      x="0" 
      y="0" 
      width="100%" 
      height="100%" 
      patternUnits="objectBoundingBox"
    >
      <image 
        href={imageUrl} 
        x="0" 
        y="0" 
        width={x} 
        height={y} 
        preserveAspectRatio="xMidYMid slice"
      />
    </pattern>
  </defs>
  
  {/* Use the pattern as fill */}
  <rect 
    width="100%" 
    height="100%" 
    fill={`url(#${frameKey})`} 
  />
      <g>
        {children}
      </g>
    </svg>
  );
};