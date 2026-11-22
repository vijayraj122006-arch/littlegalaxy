uniform float uTime;
uniform float uPixelRatio;
uniform float uSizeMultiplier;

attribute float aSize;
attribute float aTwinkle;
attribute vec3 aColor;

varying vec3 vColor;
varying float vAlpha;

void main() {
    vColor = aColor;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Gentle twinkling sine wave
    float twinkle = sin(uTime * 2.2 + aTwinkle) * 0.45 + 0.55;
    vAlpha = twinkle;
    
    // Size attenuation based on distance to camera
    float dist = -mvPosition.z;
    gl_PointSize = (aSize * uPixelRatio * uSizeMultiplier * (0.8 + 0.4 * twinkle)) * (150.0 / max(dist, 1.0));
    gl_PointSize = clamp(gl_PointSize, 1.5, 48.0);
}
