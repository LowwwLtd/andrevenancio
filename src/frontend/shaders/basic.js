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
            // zoom
            vec2 uv = vUv;
            float zoom = 0.04;
            uv *= 1.0 - zoom * hover;
            uv += zoom / 2.0 * hover;

            // colour or grayscale?
            vec4 color = texture2D(texture, uv);
            float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            gl_FragColor = mix(vec4(gray, gray, gray, 0.8), color, hover);
        }
    `,
    };
};
