import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useReflector } from "./hooks/useReflector";
import vertexShader from "./shaders/reflectiveFloor/vertex.glsl";
import fragmentShader from "./shaders/reflectiveFloor/fragment.glsl";

const ReflectiveFloor = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { textureMatrix, tDiffuse, renderReflection } = useReflector(meshRef, {
    resolution: 512,
    reflectorOffset: 0.01,
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBigWavesElevation: { value: 0.01 },
      uBigWavesFrequency: {
        value: new THREE.Vector2(1.5, 4.4),
      },
      uBigWavesSpeed: { value: 0.05 },
      uSmallWavesElevation: { value: 0.1 },
      uSmallWavesFrequency: { value: 0.3 },
      uSmallWavesSpeed: { value: 0.2 },
      uSmallIterations: { value: 2 },
      uDeepColor: { value: new THREE.Color("#6aa6b8") },
      uShallowColor: { value: new THREE.Color("#ffffff") },
      uFoamColor: { value: new THREE.Color("#9ec4d4") },
      textureMatrix: { value: textureMatrix },
      tDiffuse: { value: tDiffuse },
      uReflectionStrength: { value: 0.6 },
      uFresnelPower: { value: 1.2 },
      uDistortionScale: { value: 0.008 },
      uRippleStrength: { value: 0.01 },
      uRippleFrequency: { value: 8 },
      uRippleSpeed: { value: 0.6 },
      uRippleChromatic: { value: 0.0 },
    }),
    [],
  );

  useFrame((state) => {
    renderReflection(state);

    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uTime.value = state.clock.elapsedTime;

    material.uniforms.textureMatrix.value = textureMatrix;
    material.uniforms.tDiffuse.value = tDiffuse;
  });

  return (
    <mesh ref={meshRef} rotation-x={-Math.PI * 0.5} position={[0, -2, 0]}>
      <planeGeometry args={[150, 150, 512, 512]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
};

export default ReflectiveFloor;
