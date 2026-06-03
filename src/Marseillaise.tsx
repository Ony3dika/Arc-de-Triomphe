import { useGLTF } from "@react-three/drei";
import { Float } from "@react-three/drei";

const Marseillaise = () => {
  const { scene: napoleon } = useGLTF("./lama.glb");
  return (
    <Float floatIntensity={0.9} speed={2} rotationIntensity={0.0}>
      <primitive object={napoleon} scale={6} position={[7.5, 0.5, -30]} />
    </Float>
  );
};

useGLTF.preload("./lama.glb");

export default Marseillaise;
