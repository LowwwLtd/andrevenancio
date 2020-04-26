export const basic = ({ texture }) => {
    return {
        uniforms: {
            texture: { type: 't', value: texture },
            hover: { value: 0 },
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
        uniform float hover;
        varying vec2 vUv;

        void main() {
            vec2 uv = vUv;

            // zoom
            // uv -= vec2(0.5);
            // uv /= vec2(1.1) * (1.0 + hover);
            // uv += vec2(0.5);

            // colour or grayscale?
            vec4 color = texture2D(texture, uv);
            float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            gl_FragColor = mix(vec4(gray, gray, gray, 0.8), color, hover);
        }
    `,
    };
};
