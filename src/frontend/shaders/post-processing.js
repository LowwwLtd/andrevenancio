/* eslint-disable max-len */
import { Vector2 } from 'three';
import { simplex } from './common/simplex';

export const post = ({ texture }) => {
    return {
        uniforms: {
            // canvas resolution
            resolution: { type: 'v2', value: new Vector2() },
            // render target
            texture: { type: 't', value: texture },
            // time
            time: { type: 'f', value: 0 },
            // scroll speed
            scrollSpeed: { type: 'f', value: 0.0 },
            // scroll velocity
            scrollVelocity: { type: 'f', value: 0.0 },
            // mouse speed
            mouseSpeed: { type: 'f', value: 0.0 },
            // mouse position
            mouse: { type: 'v2', value: new Vector2(0.5) },
            // hover
            hover: { type: 'float', value: 0 },

            // custom
            u_size: { type: 'f', value: 100 * global.devicePixelRatio },
            u_noise: { type: 'v2', value: new Vector2(4.0, 4.0) },
        },

        vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

        fragmentShader: `
        uniform vec2 resolution;
        uniform sampler2D texture;
        uniform float time;
        uniform float scrollSpeed;
        uniform float scrollVelocity;
        uniform float mouseSpeed;
        uniform vec2 mouse;
        uniform float hover;

        // custom uniforms
        uniform float u_size;
        uniform vec2 u_noise;

        varying vec2 vUv;

        ${simplex()}

        float snoise01(vec3 v) {
            return snoise(v); // (1.0 + snoise(v)) * 0.5;
        }

        float grain (vec2 st, float t) {
            return fract(sin(dot(st.xy, vec2(17.0,180.)))* 2500. + t);
        }

        void main() {
            // uv with aspect ratio correction
            vec2 uv = vUv;
            vec2 suv = vUv;
            float aspect = resolution.x / resolution.y;
            suv.x *= aspect;

            // position with aspect ratio correction
            vec2 pos = mouse;
            pos.x *= aspect;

            // --------------------------------------------------
            // SCROLL EFFECT
            // --------------------------------------------------
            // vec4 t = texture2D(texture, vUv);
            // uv.y += 0.01 * scrollSpeed * 2.0 * fract(sin(dot(vec2(vUv.x), vec2(100.0, 100.0))) * 500.0);
            // t.r = texture2D(texture, uv).r;

            // uv.y += 0.01 * scrollSpeed * 2.0 * fract(sin(dot(vUv, vec2(100.0, 100.0))) * 500.0);
            // t.g = texture2D(texture, uv).g;

            // uv.y += 0.01 * scrollSpeed * 2.0 * fract(sin(dot(vec2(vUv.y), vec2(100.0, .0))) * 500.0);
            // t.b = texture2D(texture, uv).b;

            // --------------------------------------------------
            // BUBBLE EFFECT
            // --------------------------------------------------
            float n = snoise01(vec3(uv * u_noise + time * 0.3, 0.0));
            float radius = u_size / resolution.y * hover;
            float nRadius = radius * (0.6 + 0.4 * n) + clamp(mouseSpeed * 2.0 * hover, 0.0, 1.0);

            float outter = nRadius / length(pos - suv);
            outter = clamp(outter, 0.0, 1.0);
            outter = pow(outter, 16.0);

            float inner = nRadius * 1.2 / length(pos - suv);
            inner = clamp(inner, 0.0, 1.0);
            inner = pow(inner, 20.0);
            inner = 1.0 - inner;

            float halo = 1.0 - (outter + inner);

            float g = dot(texture2D(texture, uv + (n * halo)).rgb, vec3(0.299, 0.587, 0.114));

            // grayscale and colour
            vec4 color = texture2D(texture, vUv);
            vec4 grayscale = vec4(g);

            // mix grayscale and color
            vec4 c = mix(color, grayscale, inner);
            
            // noise
            c = mix(c, vec4(grain(uv, time * 1.)), 0.04);

            gl_FragColor = c;
        }
    `,
    };
};
