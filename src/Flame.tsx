import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import vertexShader from "./shaders/flame/vertex.glsl";
import fragmentShader from "./shaders/flame/fragment.glsl";

const Flame = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: [size.width, size.height] },
    }),
    [size.width, size.height],
  );

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    const dpr = state.gl.getPixelRatio();
    material.uniforms.uResolution.value = [size.width * dpr, size.height * dpr];
  });
  return (
    <>
      <mesh position={[-20, -0.8, -45]} scale={1}>
        <planeGeometry />
        <shaderMaterial
          ref={materialRef}
          attach='material'
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
};

export default Flame;
