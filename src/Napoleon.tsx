import { useGLTF } from "@react-three/drei";
import { Float } from "@react-three/drei";

const Napoleon = () => {
  const { scene: napoleon } = useGLTF("./napoleon.glb");
  return (
    <Float floatIntensity={0.9} speed={2} rotationIntensity={0.0}>
      <primitive object={napoleon} scale={6} position={[0, -1.0, -20]} />
    </Float>
  );
};

useGLTF.preload("./napoleon.glb");

export default Napoleon;
