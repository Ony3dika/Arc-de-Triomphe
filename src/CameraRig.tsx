import { useFrame, type RootState } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MathUtils, Vector2, Vector3 } from "three";

type CameraRigProps = {
  positionX?: number;
  positionY?: number;
  rotationX?: number;
  rotationY?: number;
  smoothness?: number;
};

const CameraRig = ({
  positionX = 0.4,
  positionY = 0.18,
  rotationX = 0.012,
  rotationY = 0.018,
  smoothness = 12,
}: CameraRigProps) => {
  const rawPointer = useRef(new Vector2());
  const smoothPointer = useRef(new Vector2());
  const appliedPosition = useRef(new Vector3());
  const appliedRotation = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      rawPointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      rawPointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame((state: RootState, delta: number) => {
    const t = 1 - Math.exp(-smoothness * delta);
    smoothPointer.current.x = MathUtils.lerp(
      smoothPointer.current.x,
      rawPointer.current.x,
      t,
    );
    smoothPointer.current.y = MathUtils.lerp(
      smoothPointer.current.y,
      rawPointer.current.y,
      t,
    );

    const nextPosition = new Vector3(
      smoothPointer.current.x * positionX,
      smoothPointer.current.y * positionY,
      0,
    );
    const nextRotX = -smoothPointer.current.y * rotationX;
    const nextRotY = smoothPointer.current.x * rotationY;

    state.camera.position.sub(appliedPosition.current);
    state.camera.position.add(nextPosition);
    appliedPosition.current.copy(nextPosition);

    state.camera.rotation.x -= appliedRotation.current.x;
    state.camera.rotation.y -= appliedRotation.current.y;
    appliedRotation.current.x = nextRotX;
    appliedRotation.current.y = nextRotY;
    state.camera.rotation.x += nextRotX;
    state.camera.rotation.y += nextRotY;
  });

  return null;
};

export default CameraRig;
