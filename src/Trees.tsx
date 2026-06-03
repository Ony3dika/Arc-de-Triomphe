import { useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

const Trees = () => {
  const { scene: tree, animations } = useGLTF("./tree.glb");

  const treeAnimations = useAnimations(animations, tree);
  const action = treeAnimations.actions["MorphBake"];

  useEffect(() => {
    if (action) {
      action.play();
    }
  }, [action]);

  return (
    <>
      {/* Trees */}
      <primitive scale={0.06} object={tree} position={[-2, -1.3, -2]} />
    </>
  );
};

useGLTF.preload("./tree.glb");

export default Trees;
