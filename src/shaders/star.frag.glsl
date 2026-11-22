varying vec3 vColor;
varying float vAlpha;

void main() {
    // Distance from point center (0.0 at center, 0.5 at edge)
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    
    if (dist > 0.5) {
        discard;
    }
    
    // Soft gaussian halo falloff + intense bright center
    float core = smoothstep(0.18, 0.0, dist);
    float glow = smoothstep(0.5, 0.0, dist);
    float halo = pow(glow, 1.8);
    
    // Blend core (warm bright white) into star tint
    vec3 finalColor = mix(vColor, vec3(1.0, 0.98, 0.94), core * 0.85);
    
    float alpha = (halo * 0.75 + core * 0.5) * vAlpha;
    gl_FragColor = vec4(finalColor, alpha);
}
