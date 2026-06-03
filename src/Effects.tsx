import { Vector2 } from "three";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
} from "@react-three/postprocessing";
import { Sky } from "@react-three/drei";
import { BlendFunction } from "postprocessing";
import { useControls } from "leva";
const Effects = () => {
  const { sunPosition } = useControls("Sky", {
    sunPosition: {
      value: [150, 25, 100],
    },
  });
  return (
    <>
      <Sky sunPosition={sunPosition} />

      <EffectComposer multisampling={8} autoClear={false}>
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new Vector2(0.0015, 0)}
        />

        <Noise blendFunction={BlendFunction.REFLECT} opacity={0.05} />
        <Bloom
          intensity={10}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.8}
        />
      </EffectComposer>
    </>
  );
};

export default Effects;
