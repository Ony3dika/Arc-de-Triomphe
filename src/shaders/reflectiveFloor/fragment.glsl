#include <common>

uniform vec3 uDeepColor;
uniform vec3 uShallowColor;
uniform vec3 uFoamColor;
uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uReflectionStrength;
uniform float uFresnelPower;
uniform float uDistortionScale;
uniform float uRippleStrength;
uniform float uRippleFrequency;
uniform float uRippleSpeed;
uniform float uRippleChromatic;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying vec4 vReflectUv;

float horizontalRipple(vec2 uv) {
  float t = uTime * uRippleSpeed;
  float y = uv.y * uRippleFrequency;
  float x = uv.x * uRippleFrequency * 0.35;

  float wave = sin(y + t) * 0.45;
  wave += sin(y * 2.15 - t * 1.35) * 0.28;
  wave += sin(y * 3.7 + t * 0.85 + x) * 0.15;
  wave += sin(x * 4.0 + y * 0.5 + t * 1.1) * 0.12;

  return wave;
}

vec3 sampleReflection(vec4 baseUv, float offsetX) {
  vec4 uv = baseUv;
  uv.x += offsetX * uv.w;
  return texture2DProj(tDiffuse, uv).rgb;
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(cameraPosition - vPosition);

  float mixStrength = smoothstep(-0.15, 0.35, vElevation);
  vec3 color = mix(uDeepColor, uShallowColor, mixStrength);
  color = mix(color, uFoamColor, smoothstep(0.25, 0.45, vElevation));

  float ripple = horizontalRipple(vUv);
  float shoreMask = mix(0.55, 1.0, smoothstep(-0.02, 0.12, vElevation));
  float disp = ripple * uRippleStrength * shoreMask;

  vec4 reflectUv = vReflectUv;
  reflectUv.xy += normal.xz * uDistortionScale * vElevation * reflectUv.w;

  // Multi-tap horizontal smear (soft wavy reflection bands)
  vec3 reflection = vec3(0.0);
  reflection += sampleReflection(reflectUv, disp - uRippleChromatic);
  reflection += sampleReflection(reflectUv, disp);
  reflection += sampleReflection(reflectUv, disp + uRippleChromatic);
  reflection *= 0.333333;

  float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), uFresnelPower);
  color = mix(color, reflection, fresnel * uReflectionStrength);

  float rim = pow(1.0 - abs(dot(normal, vec3(0.0, 1.0, 0.0))), 2.0);
  color += rim * 0.06;

  gl_FragColor = vec4(color, 0.95);
}
