varying vec3 vColor;
varying float vAlpha;

void main() {
    // Distance from center (-0.5 to 0.5)
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    
    if (dist > 0.5) {
        discard;
    }
    
    // Core brightness + soft exponential glowing halo
    float core = smoothstep(0.12, 0.0, dist);
    float halo = exp(-dist * 7.5);
    
    // Subtle romantic diffraction cross spikes
    vec2 absCoord = abs(coord);
    float spike = max(
        exp(-absCoord.x * 24.0) * exp(-absCoord.y * 3.5),
        exp(-absCoord.y * 24.0) * exp(-absCoord.x * 3.5)
    ) * 0.35;
    
    // Warm pure white/champagne center blending out to star color
    vec3 coreColor = vec3(1.0, 0.98, 0.95);
    vec3 finalColor = mix(vColor, coreColor, core * 0.9);
    
    float alpha = (halo * 0.85 + core * 0.9 + spike) * vAlpha;
    gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
}
