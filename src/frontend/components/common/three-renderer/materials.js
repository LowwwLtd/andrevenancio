import { ShaderMaterial } from 'three';

export const postProcessingMaterial = ({ texture }) => {
    return new ShaderMaterial({
        uniforms: {
            effectVelocity: { value: 0.0 },
            sceneTexture: { type: 't', value: texture },
        },

        vertexShader: `
            varying vec2 vUv;

            void main() {
                vUv = uv;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
        `,

        fragmentShader: `
            uniform sampler2D sceneTexture;
            uniform float effectVelocity;
            varying vec2 vUv;

            float map(float value, float inMin, float inMax, float outMin, float outMax) {
                return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
            }

            void main() {
                vec2 uv = vUv;

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

            }
        `,
    });
};

export const paperMaterial = ({ texture, imageAspectRatio, aspectRatio }) => {
    return new ShaderMaterial({
        uniforms: {
            texture: { type: 't', value: texture },
            imageAspectRatio: { value: imageAspectRatio },
            aspectRatio: { value: aspectRatio },
            opacity: { value: 1 },
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
            uniform float imageAspectRatio;
            uniform float aspectRatio;
            uniform float opacity;
            uniform float hover;
            varying vec2 vUv;

            float exponentialInOut(float t) {
                return t == 0.0 || t == 1.0
                    ? t
                    : t < 0.5
                    ? +0.5 * pow(2.0, (20.0 * t) - 10.0)
                    : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
            }

            void main() {
                vec2 uv = vUv;

                // fix aspectRatio
                float u = imageAspectRatio/aspectRatio;
                if(imageAspectRatio > aspectRatio) {
                    u = 1. / u;
                }
                uv.y *= u;
                uv.y -= (u)/2.-.5;

                // hover effect
                float zoomLevel = .2;

                float hoverLevel = exponentialInOut(min(1., (distance(vec2(.5), uv) * hover) + hover));
                uv *= 1. - zoomLevel * hoverLevel;
                uv += zoomLevel / 2. * hoverLevel;

                uv = clamp(uv, 0., 1.);

                vec4 color = texture2D(texture, uv);

                gl_FragColor = mix(vec4(1.,1.,1.,opacity), color, opacity);

            }
        `,
    });
};
