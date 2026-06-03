import { forwardRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { Object3D } from "three";

const Arc = forwardRef<Object3D, { position?: [number, number, number] }>(
  ({ position }, ref) => {
    const { scene: arc } = useGLTF("./arc.glb");
    const clone = useMemo(() => arc.clone(), [arc]);

    return <primitive ref={ref} object={clone} scale={0.07} position={position} />;
  },
);

Arc.displayName = "Arc";

useGLTF.preload("./arc.glb");

export default Arc;
