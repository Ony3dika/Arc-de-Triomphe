uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;
uniform mat4 textureMatrix;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying vec4 vReflectUv;

#include ../includes/perlin.glsl

float waveElevation(vec3 position) {
  float elevation =
    sin(position.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
    sin(position.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
    uBigWavesElevation;

  for (float i = 1.0; i <= uSmallIterations; i++) {
    elevation -= abs(
      perlinClassic3D(
        vec3(
          position.xz * uSmallWavesFrequency * i,
          uTime * uSmallWavesSpeed
        )
      ) * uSmallWavesElevation / i
    );
  }

  return elevation;
}

void main() {
  float shift = 0.01;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec3 modelPositionA = modelPosition.xyz + vec3(shift, 0.0, 0.0);
  vec3 modelPositionB = modelPosition.xyz + vec3(0.0, 0.0, -shift);

  float elevation = waveElevation(modelPosition.xyz);
  modelPosition.y += elevation;
  modelPositionA.y += waveElevation(modelPositionA);
  modelPositionB.y += waveElevation(modelPositionB);

  vec3 toA = normalize(modelPositionA - modelPosition.xyz);
  vec3 toB = normalize(modelPositionB - modelPosition.xyz);
  vec3 computeNormal = normalize(cross(toA, toB));

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  // Local plane coords — textureMatrix already includes modelMatrix (see useReflector)
  vReflectUv = textureMatrix * vec4(position, 1.0);
  vElevation = elevation;
  vNormal = normalize(mat3(modelMatrix) * computeNormal);
  vPosition = modelPosition.xyz;
  vUv = uv;
}
