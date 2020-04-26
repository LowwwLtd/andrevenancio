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
