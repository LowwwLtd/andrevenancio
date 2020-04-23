export const post = ({ texture }) => {
    return {
        uniforms: {
            effectVelocity: { value: 0.0 },
            sceneTexture: { type: 't', value: texture },
        },

        vertexShader: `
        varying vec2 v_uv;

        void main() {
            v_uv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

        fragmentShader: `
        uniform sampler2D sceneTexture;
        uniform float effectVelocity;
        varying vec2 v_uv;

        void main() {
            vec2 uv = v_uv;

            vec4 texture = texture2D(sceneTexture, v_uv);
            uv.y += 0.01 * effectVelocity * 2.0 * fract(sin(dot(vec2(v_uv.x), vec2(100.0, 100.0))) * 500.0);
            texture.r = texture2D(sceneTexture, uv).r;

            uv.y += 0.01 * effectVelocity * 2.0 * fract(sin(dot(v_uv, vec2(100.0, 100.0))) * 500.0);
            texture.g = texture2D(sceneTexture, uv).g;

            uv.y += 0.01 * effectVelocity * 2.0 * fract(sin(dot(vec2(v_uv.y), vec2(100.0, .0))) * 500.0);
            texture.b = texture2D(sceneTexture, uv).b;

            gl_FragColor = mix(texture, texture2D(sceneTexture, v_uv), 0.);
        }
    `,
    };
};

/*
vec2 uv = v_uv;
uv.y += 0.01 * effectVelocity * 10.0 * fract(sin(dot(vec2(v_uv.x), vec2(12.9, 78.2))) * 437.5);
gl_FragColor = texture2D(sceneTexture, uv); // mix(uv, v_uv, v_uv.y)
*/

/*
float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

vec2 uv = v_uv;
vec4 texture = texture2D(sceneTexture, uv);
float curveLevel = min(1., effectVelocity *.5);
float nUvY = pow(1.- uv.y * 1.2, 10.) * curveLevel;

if(nUvY < .001) {
    gl_FragColor = texture2D(sceneTexture, uv);
} else {
    float curve = max(0., nUvY) + 1.;
    curve = map(curve, 1., 5., 1., 2.);
    uv.x = uv.x/curve + ((curve - 1.)/2./curve);
    //Curve generation
    texture = texture2D(sceneTexture, clamp(uv, vec2(0.), vec2(1.)));
    //Pixel displace
    uv.y += texture.r * nUvY * .7;
    if(uv.y < 1.) texture = texture2D(sceneTexture, uv);
    // RGB shift
    uv.y += 0.15 * nUvY;
    if(uv.y < 1.) texture.g = texture2D(sceneTexture, uv).g;
    uv.y += 0.10 * nUvY;
    if(uv.y < 1.) texture.b = texture2D(sceneTexture, uv).b;

     gl_FragColor = texture;
 }
*/
