import { Sparkles } from "@react-three/drei";
import { Leva, useControls } from "leva";
import Arc from "./Arc";
import Trees from "./Trees";
  // import { Perf } from "r3f-perf";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Napoleon from "./Napoleon";
import Marseillaise from "./Marseillaise";
import ReflectiveFloor from "./ReflectiveFloor";
// import Effects from "./Effects";
import CameraRig from "./CameraRig";
import Flame from "./Flame";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const { camera } = useThree();

  const { bg } = useControls({
    bg: { value: "#7f99aa" },
  });
  useGSAP(
    () => {
      const timeLine = gsap.timeline({
        scrollTrigger: {
          trigger: ".main",
          start: "top top",
          end: "bottom bottom",
          endTrigger: "#chapter-4",
          scrub: true,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });

      // Hero — reset rotation then zoom toward the Arc
      timeLine
        .to(camera.rotation, { x: 0, y: 0, z: 0, ease: "none" }, 0)
        .to(camera.position, { x: 0, y: -1.5, z: 4, ease: "none" }, 0.25)
        .to(camera.position, { x: 0, y: -1.5, z: -7, ease: "none" }, 0.5);

      // Chapter 1 — Napoleon (finishes at t = 1.0)
      timeLine.to(camera.position, { x: 0, y: 1, z: -10, ease: "none" }, 0.7);

      // Chapter 2 — La Marseillaise (finishes at t = 2.0)
      timeLine.to(camera.position, { x: 10, y: 0, z: -30, ease: "none" }, 1.7);

      // Chapter 3 — Eternal Flame (finishes at t = 3.0)
      timeLine.to(
        camera.position,
        { x: -20, y: -1, z: -40, ease: "none" },
        2.7,
      );

      // Chapter 4 — Far Arc (finishes at t = 4.0)
      timeLine.to(camera.position, { x: 0, y: 0, z: -60, ease: "none" }, 3.7);
    },
    { dependencies: [] },
  );

  return (
    <>
      {/* <Perf position='top-left' /> */}
      <Leva hidden />

      <CameraRig />
      <ambientLight intensity={2.5} />
      <color attach={"background"} args={[bg]} />

      {/* Models */}
      <Trees />
      <Arc position={[0, -2.1, 0]} />
      <Napoleon />
      <Marseillaise />
      <Flame />
      <Arc position={[0, -2.1, -70]} />
      <ReflectiveFloor />
      <Sparkles
        count={200}
        noise={4}
        size={3}
        scale={8}
        opacity={0.6}
        speed={0.5}
      />

      {/* Effects */}
      {/* <Effects /> */}
    </>
  );
};

export default Experience;
