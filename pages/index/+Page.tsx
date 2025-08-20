import Header from "../../components/Header";
import Footer from "../../components/Footer";

import Frame1 from "../../assets/index/frame-1.webp";
import Frame2 from "../../assets/index/frame-2.webp";
import Frame3 from "../../assets/index/frame-3.webp";
import Frame4 from "../../assets/index/frame-4.webp";
import Frame5 from "../../assets/index/frame-5.webp";
import Frame6 from "../../assets/index/frame-6.webp";
import Frame7 from "../../assets/index/frame-7.webp";
import Frame8 from "../../assets/index/frame-8.webp";
import { useEffect, useRef, useState } from "react";
import Main from "../../components/Main";

const frames = [Frame1, Frame2, Frame3, Frame4, Frame5, Frame6, Frame7, Frame8];

export default function Page() {
  const [currentFrame, setCurrentFrame] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentFrame((prev) => (prev + 1) % frames.length);
  //   }, 150);
  //   return () => clearInterval(interval);
  // }, []);

  const intervalRef = useRef<number | null>(null);

  const startAnimation = () => {
    if (intervalRef.current) return; // 避免重複啟動
    intervalRef.current = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 150);
  };

  const stopAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAnimation();
    return stopAnimation; // 清除定時器
  }, []);

  return (
    <div className="h-dvh flex flex-col justify-between">
      <Header />
      <Main className="flex m-auto">
        <div className="m-auto max-w-lg">
          <img
            src={frames[currentFrame]}
            alt=""
            className="cursor-pointer"
            onMouseEnter={stopAnimation}
            onMouseLeave={startAnimation}
          />
        </div>
      </Main>
      <Footer />
    </div>
  );
}
