import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Preloader = ({
  started,
  onStarted,
  onEnterWithAudio,
}: {
  started: boolean;
  onStarted: () => void;
  onEnterWithAudio: () => void;
}) => {
  const { progress, active } = useProgress();
  const [complete, setComplete] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progress === 100 || !active) {
      const timer = setTimeout(() => setComplete(true), 200);
      return () => clearTimeout(timer);
    }
  }, [progress, active]);

  // Exit animation
  useEffect(() => {
    if (started && containerRef.current) {
      gsap.to(containerRef.current, {
        yPercent: -100,
        duration: 1.1,
        ease: "power3.inOut",
      });
    }
  }, [started]);

  const messages = [
    "Loading the Arc...",
    "Igniting the eternal flame...",
    "Planting the trees...",
    "Summoning Napoleon...",
    "Almost there...",
  ];

  const messageIndex = Math.min(
    Math.floor((complete ? 100 : progress) / (100 / messages.length)),
    messages.length - 1,
  );

  const pct = Math.round(complete ? 100 : progress);

  return (
    <div
      ref={containerRef}
      className='fixed inset-0 z-50 items-center justify-between flex flex-col preloader bg-[#232323]'
    >
      <div className='basis-1/5' />

      <div className='flex flex-col items-center '>
        <p className='xl:text-8xl text-5xl text-center text-'>
          Arc de Triomphe
        </p>
        <p className='text-xl text-center'>{messages[messageIndex]}</p>
        <button
          onClick={onEnterWithAudio}
          className={`text-base tracking-wide uppercase rounded-4xl mt-10 bg-alt text-primary shadow-2xl hover:bg-alt/80 duration-500 ease-out shadow-alt xl:px-12 px-6 xl:py-5 py-2 w-fit transition-transform cursor-pointer ${
            complete
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          Enter with Audio
        </button>
        <button
          onClick={onStarted}
          className={`text-sm tracking-wide uppercase bg-transparent text-white/70 hover:text-white/90 duration-500 ease-out mt-6 w-fit transition-transform cursor-pointer ${
            complete
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          Enter without Audio
        </button>
      </div>
      <p className='text-end text-5xl w-full p-3'>{pct}% </p>
    </div>
  );
};

export default Preloader;
