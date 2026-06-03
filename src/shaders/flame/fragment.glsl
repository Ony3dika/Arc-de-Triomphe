uniform float uTime;
uniform vec2 uResolution;

void main() {
    vec2 I = gl_FragCoord.xy;
    float t = uTime * 0.3;
    float i = 0.0;
    float z = 0.0;
    float d = 0.0;
    
    vec4 fragColor = vec4(0.0);

    for (fragColor *= i; i++ < 50.0; fragColor += (sin(z / 3.0 + vec4(7.0, 2.0, 3.0, 0.0)) + 1.1) / d) {
        vec3 p = z * normalize(vec3(I + I, 0.0) - uResolution.xyy);
        p.z += 5.0 + cos(t);
        p.xz *= mat2(cos(p.y * 0.5 + vec4(0.0, 33.0, 11.0, 0.0))) / max(p.y * 0.1 + 1.0, 0.1);
        
        for (d = 2.0; d < 15.0; d /= 0.6) {
            p += cos((p.yzx - vec3(t / 0.1, t, d)) * d) / d;
        }
        
        d = 0.01 + abs(length(p.xz) + p.y * 0.3 - 0.5) / 7.0;
        z += d;
    }
    
    // Adjust the divisor (e.g. 4000.0 instead of 1000.0) to reduce brightness and recover detail
    gl_FragColor = tanh(fragColor / 7000.0);
   

    // Calculate brightness to fade out the edges smoothly
    float brightness = max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b));

    // gl_FragColor = vec4(gl_FragColor.r, gl_FragColor.g * 0.8, 0.8, brightness );
    gl_FragColor.a = brightness;
}