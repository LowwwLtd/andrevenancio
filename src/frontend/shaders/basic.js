export const basic = ({ texture }) => {
    return {
        uniforms: {
            texture: { type: 't', value: texture },
            iTime: { type: 'f', value: 0 },
        },

        vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,

        fragmentShader: `
        uniform sampler2D texture;
        uniform float iTime;
        uniform float hover;
        varying vec2 vUv;

        void main() {
            vec2 uv = vUv;
            // uv -= vec2(0.5);
            // uv *= 1.0 + (0.5 + 0.5 * cos(iTime * 10.0)) * 0.1; // * hover;
            // uv += vec2(0.5);

            gl_FragColor = texture2D(texture, uv);
        }
    `,
    };
};
