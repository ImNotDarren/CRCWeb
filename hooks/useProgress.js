import { useState, useEffect } from 'react';

const useProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const nextProgress = prevProgress + 0.01;
        if (nextProgress >= 0.99) {
          clearInterval(interval);
          return 0.99;
        }
        return nextProgress;
      });
    }, 100); // updates every 100 milliseconds

    return () => clearInterval(interval); // cleanup interval on component unmount
  }, []);

  return progress;
};

export default useProgress;