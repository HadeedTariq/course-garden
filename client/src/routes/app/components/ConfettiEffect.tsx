import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export default () => {
  const { width, height } = useWindowSize();

  const [renderConfetti, setRenderConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRenderConfetti(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);
  return <>{renderConfetti && <Confetti width={width} height={height} />}</>;
};
