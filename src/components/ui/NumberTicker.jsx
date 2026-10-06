import React, { useEffect, useRef, useState } from 'react';

export function NumberTicker({ 
  value, 
  direction = 'up', 
  delay = 0, 
  className = '',
  decimalPlaces = 0 
}) {
  const [displayValue, setDisplayValue] = useState(() => {
    const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, '')) || 0;
    return num;
  });

  const prevValueRef = useRef(displayValue);

  useEffect(() => {
    const target = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, '')) || 0;
    const start = prevValueRef.current;
    if (start === target) return;

    let startTime = null;
    const duration = 800; // ms

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (target - start) * ease;
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        prevValueRef.current = target;
        setDisplayValue(target);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [value]);

  const formatted = displayValue.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  return (
    <span className={`tabular-nums font-mono ${className}`}>
      {formatted}
    </span>
  );
}

export default NumberTicker;
