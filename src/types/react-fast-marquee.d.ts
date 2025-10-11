declare module 'react-fast-marquee' {
  import * as React from 'react';
  export interface MarqueeProps {
    speed?: number;
    gradient?: boolean;
    gradientColor?: [number, number, number];
    gradientWidth?: number | string;
    pauseOnHover?: boolean;
    pauseOnClick?: boolean;
    direction?: 'left' | 'right';
    play?: boolean;
    delay?: number;
    loop?: number;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  }
  const Marquee: React.FC<MarqueeProps>;
  export default Marquee;
}


