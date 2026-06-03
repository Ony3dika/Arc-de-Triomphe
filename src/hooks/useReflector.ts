import { useThree, type RootState } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, type RefObject } from "react";
import * as THREE from "three";

type UseReflectorOptions = {
  resolution?: number;
  reflectorOffset?: number;
};

/**
 * Planar reflection render target (same technique as drei's MeshReflectorMaterial).
 */
export function useReflector(
  meshRef: RefObject<THREE.Mesh | null>,
  { resolution = 1024, reflectorOffset = 0 }: UseReflectorOptions = {},
) {
  const { gl, camera, scene, size } = useThree();

  const reflectorPlane = useMemo(() => new THREE.Plane(), []);
  const normal = useMemo(() => new THREE.Vector3(), []);
  const reflectorWorldPosition = useMemo(() => new THREE.Vector3(), []);
  const cameraWorldPosition = useMemo(() => new THREE.Vector3(), []);
  const rotationMatrix = useMemo(() => new THREE.Matrix4(), []);
  const lookAtPosition = useMemo(() => new THREE.Vector3(0, 0, -1), []);
  const clipPlane = useMemo(() => new THREE.Vector4(), []);
  const view = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const q = useMemo(() => new THREE.Vector4(), []);
  const textureMatrix = useMemo(() => new THREE.Matrix4(), []);
  const virtualCamera = useMemo(() => new THREE.PerspectiveCamera(), []);

  const fboSize = useMemo(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const width = Math.round(resolution * aspect);
    const height = resolution;
    return { width, height };
  }, [resolution, size.width, size.height]);

  const fbo = useMemo(() => {
    const { width, height } = fboSize;
    const target = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.HalfFloatType,
    });
    target.depthBuffer = true;
    target.depthTexture = new THREE.DepthTexture(width, height);
    target.depthTexture.format = THREE.DepthFormat;
    target.depthTexture.type = THREE.UnsignedShortType;
    return target;
  }, [fboSize]);

  const beforeRender = useCallback(() => {
    const mesh = meshRef.current;
    if (!mesh) return false;

    reflectorWorldPosition.setFromMatrixPosition(mesh.matrixWorld);
    cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);
    rotationMatrix.extractRotation(mesh.matrixWorld);
    normal.set(0, 0, 1);
    normal.applyMatrix4(rotationMatrix);
    reflectorWorldPosition.addScaledVector(normal, reflectorOffset);
    view.subVectors(reflectorWorldPosition, cameraWorldPosition);

    if (view.dot(normal) > 0) return false;

    view.reflect(normal).negate();
    view.add(reflectorWorldPosition);
    rotationMatrix.extractRotation(camera.matrixWorld);
    lookAtPosition.set(0, 0, -1);
    lookAtPosition.applyMatrix4(rotationMatrix);
    lookAtPosition.add(cameraWorldPosition);
    target.subVectors(reflectorWorldPosition, lookAtPosition);
    target.reflect(normal).negate();
    target.add(reflectorWorldPosition);
    virtualCamera.position.copy(view);
    virtualCamera.up.set(0, 1, 0);
    virtualCamera.up.applyMatrix4(rotationMatrix);
    virtualCamera.up.reflect(normal);
    virtualCamera.lookAt(target);
    virtualCamera.far = camera.far;
    virtualCamera.updateMatrixWorld();
    virtualCamera.projectionMatrix.copy(camera.projectionMatrix);

    textureMatrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
    textureMatrix.multiply(virtualCamera.projectionMatrix);
    textureMatrix.multiply(virtualCamera.matrixWorldInverse);
    textureMatrix.multiply(mesh.matrixWorld);

    reflectorPlane.setFromNormalAndCoplanarPoint(normal, reflectorWorldPosition);
    reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse);
    clipPlane.set(
      reflectorPlane.normal.x,
      reflectorPlane.normal.y,
      reflectorPlane.normal.z,
      reflectorPlane.constant,
    );
    const projectionMatrix = virtualCamera.projectionMatrix;
    q.x =
      (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) /
      projectionMatrix.elements[0];
    q.y =
      (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) /
      projectionMatrix.elements[5];
    q.z = -1.0;
    q.w =
      (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];
    clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));
    projectionMatrix.elements[2] = clipPlane.x;
    projectionMatrix.elements[6] = clipPlane.y;
    projectionMatrix.elements[10] = clipPlane.z + 1.0;
    projectionMatrix.elements[14] = clipPlane.w;

    return true;
  }, [
    camera,
    meshRef,
    reflectorOffset,
    reflectorPlane,
    normal,
    reflectorWorldPosition,
    cameraWorldPosition,
    rotationMatrix,
    lookAtPosition,
    clipPlane,
    view,
    target,
    q,
    textureMatrix,
    virtualCamera,
  ]);

  const renderReflection = useCallback(
    (_state: RootState) => {
      const mesh = meshRef.current;
      if (!mesh || !beforeRender()) return;

      mesh.visible = false;
      const xrEnabled = gl.xr.enabled;
      const shadowAutoUpdate = gl.shadowMap.autoUpdate;
      gl.xr.enabled = false;
      gl.shadowMap.autoUpdate = false;
      gl.setRenderTarget(fbo);
      gl.state.buffers.depth.setMask(true);
      if (!gl.autoClear) gl.clear();
      gl.render(scene, virtualCamera);
      gl.xr.enabled = xrEnabled;
      gl.shadowMap.autoUpdate = shadowAutoUpdate;
      mesh.visible = true;
      gl.setRenderTarget(null);
    },
    [beforeRender, fbo, gl, meshRef, scene, virtualCamera],
  );

  useEffect(() => () => fbo.dispose(), [fbo]);

  return {
    textureMatrix,
    tDiffuse: fbo.texture,
    renderReflection,
  };
}
