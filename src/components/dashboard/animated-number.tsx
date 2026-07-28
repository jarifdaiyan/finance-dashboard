"use client";

import * as React from "react";
import { animate } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  formatter: (n: number) => string;
  className?: string;
  duration?: number;
}

export function AnimatedNumber({ value, formatter, className, duration = 1.1 }: AnimatedNumberProps) {
  const [display, setDisplay] = React.useState(0);
  const prevValue = React.useRef(0);

  React.useEffect(() => {
    const controls = animate(prevValue.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    prevValue.current = value;
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{formatter(display)}</span>;
}
