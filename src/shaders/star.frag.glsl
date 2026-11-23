varying vec3 vColor;
varying float vAlpha;

void main() {
    // Distance from center (-0.5 to 0.5)
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distSq = dot(coord, coord);
    
    if (distSq > 0.25) {
        discard;
    }
    
    // Natural smooth Gaussian starlight curve
    float starGlow = exp(-distSq * 18.0);
    
    // Bright pinpoint core
    float core = exp(-distSq * 80.0);
    
    vec3 coreColor = vec3(1.0, 0.98, 0.95);
    vec3 finalColor = mix(vColor, coreColor, core * 0.7);
    
    float alpha = clamp((starGlow * 0.75 + core * 0.85) * vAlpha, 0.0, 1.0);
    gl_FragColor = vec4(finalColor, alpha);
}
