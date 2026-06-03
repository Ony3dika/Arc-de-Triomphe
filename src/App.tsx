import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import Experience from "./Experience";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import SplitText from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Preloader from "./Preloader";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

const credits = [
  {
    title: "Arc de Triomphe",
    creator: "HoangHiepVu",
    link: "https://sketchfab.com/3d-models/arc-de-triomphe-paris-with-texture-f5096afb1a3345e2bf1a82231d9f89c4",
  },

  {
    title: "Napoleon",
    creator: "Virtual Museums of Małopolska",
    link: "https://sketchfab.com/3d-models/the-bust-of-napoleon-bonaparte-a177bf0e121641bea6cf1d58ad3efc5b",
  },

  {
    title: "La Marseillaise",
    creator: "Mesheritage",
    link: "https://sketchfab.com/3d-models/cast-of-la-marseillaise-3674251455b04b5a8d16206060d7c182",
  },

  {
    title: "Flame ",
    creator: "Xor",
    link: "https://fragcoord.xyz/s/3wwbs9kb",
  },
  {
    title: "Cinematic Softness",
    creator: "AtlasAudio",
    link: "https://pixabay.com/music/meditationspiritual-cinematic-softness-511863/",
  },
];

const CameraUpdater = ({ isMobile }: { isMobile: boolean }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0.5, -0.4, isMobile ? 20 : 10);
    camera.rotation.set(0, 0.25, 0);
    camera.updateProjectionMatrix();
  }, [isMobile, camera]);

  return null;
};

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [start, setStart] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/atlas-cinematic.mp3");
    audio.loop = true;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  const handleStart = () => {
    audioRef.current?.play().catch(() => {});
    setStart(true);
  };

  const handleEnterWithAudio = () => {
    setMuted(false);
    handleStart();
  };

  const lenis = new Lenis();

  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Text Animations
  useGSAP(
    () => {
      document.querySelectorAll(".body-text").forEach((text) => {
        const split = new SplitText(text, {
          type: "lines",
          mask: "lines",
        });

        gsap.from(split.lines, {
          scrollTrigger: {
            trigger: text,
            scroller: document.body,
            start: "top 85%",
            scrub: false,
            toggleActions: "play none none reverse",
          },
          filter: "blur(15px)",
          scaleY: 0.8,
          transformOrigin: "top",
          opacity: 0,
          stagger: { each: 0.1, from: "start" },
        });
      });
    },
    { dependencies: [] },
  );

  return (
    <main className='bg-primary relative overflow-x-clip font-bellefair text-white/80'>
      <header className='fixed top-0 left-0 z-5 p-5'></header>
      <svg className='hidden'>
        <filter id='glass'>
          <feImage href='/image.png' preserveAspectRatio='none' />

          <feDisplacementMap
            in='SourceGraphic'
            scale={300}
            xChannelSelector='R'
            yChannelSelector='G'
          />
        </filter>
      </svg>
      <Preloader
        started={start}
        onStarted={handleStart}
        onEnterWithAudio={handleEnterWithAudio}
      />
      {/* Scene */}

      <section className='main absolute top-0 left-0 z-0 cursor-grab h-screen w-full'>
        <Canvas
          camera={{
            fov: 30,
            near: 0.1,
            far: 25,
          }}
          dpr={[1, 2]}
          gl={{
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: true,
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <CameraUpdater isMobile={isMobile} />
          <Experience />
        </Canvas>
      </section>
      {/* Hero */}

      <section
        id='hero'
        className='relative p-5 h-screen w-screen overflow-y-clip'
      >
        <p className='text-center uppercase text-sm'>Arc de Triomphe</p>
        <div className='flex xl:gap-y-14 gap-y-10 flex-col justify-center items-start h-full xl:px-10 px-5'>
          <p className='font-semibold xl:text-9xl text-6xl max-w-xl'>
            Arc de Triomphe
          </p>
          <p className='xl:text-xl max-w-xl'>
            The Arc de Triomphe de l'Étoile, often simply called the Arc de
            Triomphe, is one of the most famous monuments in Paris, France.
          </p>

          <button
            onClick={() => {
              gsap.to(window, {
                scrollTo: { y: "#chapter-1" },
                ease: "sine.inOut",
                duration: 3,
              });
            }}
            className='bg-alt cursor-pointer rounded-full px-5 py-2 text-primary text-xl'
          >
            Enter Experience
          </button>
        </div>
      </section>

      {/* Chapter 1 Napoleon Section */}
      <section
        id='chapter-1'
        className='relative h-screen text-text pointer-events-auto w-full flex flex-col justify-center items-center'
      >
        <h1 className='body-text text-center xl:text-8xl text-5xl font-semibold'>
          Napoleon's Vision
        </h1>

        <p className='body-text max-w-xl mt-20 text-center xl:text-lg text-base'>
          On the 18th of February, 1806, flushed with victory after the Battle
          of Austerlitz, Napoleon Bonaparte decreed a monument worthy of his
          Grande Armée. He wanted not just a gate, but a declaration. A stone
          roar, frozen in time. Architect Jean Chalgrin was commissioned to
          design it in the Neoclassical style drawing from ancient Rome, but on
          a scale no Roman had dared. Construction began on Napoleon's birthday.
          He never saw it finished.
        </p>
      </section>

      {/* Chapter 2 Construction Section */}
      <section
        id='chapter-2'
        className='relative h-screen text-text w-full flex flex-col justify-center items-center'
      >
        <h1 className='body-text text-center xl:text-8xl text-5xl font-semibold'>
          Four Faces, Four Wars
        </h1>

        <p className='body-text max-w-xl mt-20 text-center xl:text-lg text-base mix-blend-difference'>
          The four colossal relief sculptures carved into the arch are not
          decoration — they are history pressed into limestone. The most
          celebrated, La Marseillaise, shows a winged Liberty leading the people
          to war, mouth open in a silent, eternal cry. Sculpted by François
          Rude, it is considered one of the greatest works of French
          Romanticism. Surrounding her: triumph, resistance, peace, and the
          promise of more war. The arch does not lie about what glory costs.
        </p>
      </section>

      {/* Chapter 3 The Eternal Flame */}
      <section
        id='chapter-3'
        className='relative h-screen text-text w-full flex flex-col justify-center items-center '
      >
        <h1 className='body-text text-center xl:text-8xl text-5xl font-semibold'>
          A Soldier with No Name
        </h1>

        <p className='body-text max-w-xl mt-20 text-center xl:text-lg text-base'>
          Two years to the day after the Armistice, an Unknown Soldier was
          interred beneath the arch — chosen from eight unidentified men fallen
          on the Western Front. He represents the 1.4 million French soldiers
          who did not come home.
        </p>
      </section>

      {/* Chapter 4 Still Standing */}
      <section
        id='chapter-4'
        className='relative h-screen text-text w-full flex flex-col justify-center items-center '
      >
        <h1 className='body-text text-center xl:text-8xl text-5xl font-semibold'>
          Stone That Outlasts Empires
        </h1>

        <p className='body-text max-w-xl mt-20 text-base text-center xl:text-lg'>
          The empire that built it collapsed within a decade. The soldiers it
          honoured are long dead. And yet the arch stands — witnessing
          coronations and revolutions, Nazi occupation and tearful liberation,
          Bastille Day jets and a 2021 wrapping in 25,000 square metres of
          silver-blue fabric. Every evening, without ceremony, the flame is
          rekindled beneath it. The city moves. The arch does not.
        </p>
      </section>

      {/* Mute Button */}

      {start && (
        <button
          onClick={() => setMuted(!muted)}
          className='fixed bottom-5 left-5 z-3 cursor-pointer'
        >
          {muted ? (
            <img src='/volume_off.svg' className='w-8 h-8' alt='mute' />
          ) : (
            <img src='/volume_up.svg' className='w-8 h-8' alt='unmute' />
          )}
        </button>
      )}

      {/* Credits */}
      <div className='fixed bottom-0 right-0 z-5'>
        <div
          className={`transition-all duration-400 ease-out origin-bottom-right text-black rounded-lg overflow-hidden  ${
            creditsOpen
              ? "opacity-100 scale-y-100 mb-0 mr-5"
              : "opacity-0 scale-0 mb-0"
          }`}
        >
          <div
            className='p-3 min-w-48 
          backdrop-filter-[brightness(1.1)_url(#glass)]'
          >
            <p className='font-semibold text-sm mb-2'>Credits</p>
            <ul className='text-xs space-y-1'>
              {credits.map((credit, index) => (
                <li key={index}>
                  <a
                    href={credit.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-500 hover:underline'
                  >
                    {credit.title}
                  </a>

                  <span> by {credit.creator}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className='flex justify-end p-5'>
          <button
            onClick={() => setCreditsOpen(!creditsOpen)}
            className='text-alt font-semibold cursor-pointer transition-colors'
          >
            {creditsOpen ? "Close" : "Credits"}
          </button>
        </footer>
      </div>
    </main>
  );
}

export default App;
