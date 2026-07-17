import { useEffect, useRef, useState } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-in-left' | 'slide-in-right' | 'slide-in-up' | 'bounce-in' | 'fade-in-scale';
  delay?: number;
  triggerOnce?: boolean;
}

const AnimatedSection = ({ 
  children, 
  className = '', 
  animation = 'fade-in',
  delay = 0,
  triggerOnce = true 
}: AnimatedSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
          setTimeout(() => {
            setIsVisible(true);
            if (triggerOnce) setHasAnimated(true);
          }, delay);
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay, triggerOnce, hasAnimated]);

  const animationClass = isVisible ? `animate-${animation}` : 'opacity-0';

  return (
    <div 
      ref={ref} 
      className={`transition-opacity duration-300 ${animationClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;