import React, { PureComponent } from 'react';
import {
    OrthographicCamera,
    Scene,
    WebGLRenderer,
    PlaneGeometry,
    Mesh,
    MeshNormalMaterial,
    Vector2,
    WebGLRenderTarget,
    LinearFilter,
    NearestFilter,
    ShaderMaterial,
} from 'three';
// import { TweenLite } from 'gsap';
import { post } from 'app/shaders/post-processing';
import { Context } from '../context';

const ratio = global.devicePixelRatio;

const compare = (a, b) => {
    // check array sizes
    if (a.length !== b.length) {
        return false;
    }

    // check if property uid is different is both arrays
    for (let i = 0; i < a.length; i++) {
        if (a[i].uid !== b[i].uid) {
            return false;
        }
    }

    return true;
};

export class WebGL extends PureComponent {
    static contextType = Context;

    canvas = React.createRef();

    constructor(props) {
        super(props);

        this.update.bind(this);
        this.offset = new Vector2();

        this.velocity = 0;
        this.curVelocity = 0;
        this.oldScrollTop = 0;
    }

    componentDidMount() {
        this.setup();
        this.resize();
        this.update();

        this.prevContext = this.context;

        this.updateChildrenTree(this.context.elements);
    }

    componentDidUpdate() {
        const same = compare(this.prevContext.elements, this.context.elements);
        this.prevContext = this.context;
        if (!same) {
            this.updateChildrenTree(this.context.elements);
        }
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.raf);
    }

    setup() {
        const w = global.innerWidth * 0.5;
        const h = global.innerHeight * 0.5;

        this.renderer = new WebGLRenderer({
            canvas: this.canvas.current,
            antialias: true,
            alpha: true,
            // premultipliedAlpha: true,
            // preserveDrawingBufer: true,
        });

        this.postprocessingScene = new Scene();

        this.scene = new Scene();

        this.camera = new OrthographicCamera(-w, w, h, -h, 1, 10);
        this.camera.position.z = 1;

        // ----------------
        // post processing
        // ----------------
        this.bufferTexture = new WebGLRenderTarget(
            global.innerWidth,
            global.innerHeight,
            { minFilter: LinearFilter, magFilter: NearestFilter }
        );

        const geometry = new PlaneGeometry(1, 1);
        this.postProcessingMaterial = new ShaderMaterial(
            post({ texture: this.bufferTexture })
        );

        this.plane = new Mesh(geometry, this.postProcessingMaterial);
        this.plane.scale.set(global.innerWidth, global.innerHeight, 1);
        this.plane.material.needsUpdate = true;
        this.postprocessingScene.add(this.plane);
    }

    update = () => {
        // start
        this.scrollingContainer =
            this.scrollingContainer ||
            document.scrollingElement ||
            document.documentElement;
        this.curVelocity =
            (global.scrollY || this.scrollingContainer.scrollTop) -
            this.oldScrollTop;
        this.oldScrollTop =
            global.scrollY || document.documentElement.scrollTop;

        this.velocity += (this.curVelocity - this.velocity) / 4.0;

        // end
        this.raf = requestAnimationFrame(this.update);

        // add offset to position
        for (let i = 0; i < this.scene.children.length; i++) {
            const { rectangle } = this.scene.children[i].userData.element;

            // update position
            let x = rectangle.x + this.offset.x;
            x += rectangle.width / 2;
            x *= ratio;
            x -= this.width / 2;
            let y = rectangle.y - this.offset.y;
            y += rectangle.height / 2;
            y *= ratio;
            y -= this.height / 2;
            y *= -1;

            // TODO:
            // this.mouse.x = (event.clientX / this.viewport.width) * 2 - 1
            // this.mouse.y = -(event.clientY / this.viewport.height) * 2 + 1

            this.scene.children[i].position.set(x, y, 0);
        }
        // enable is you dont want postprocessing
        // this.renderer.render(this.scene, this.camera);

        this.postprocessing();
    };

    postprocessing = () => {
        // ease the effect velocity

        // this.postProcessingMaterial.uniforms.effectVelocity.value = 10;
        this.postProcessingMaterial.uniforms.effectVelocity.value =
            Math.abs(this.velocity) / 10;

        this.renderer.setRenderTarget(this.bufferTexture);
        this.renderer.render(this.scene, this.camera);
        this.postProcessingMaterial.uniforms.sceneTexture.value = this.bufferTexture.texture;
        this.renderer.setRenderTarget(null);

        // render final scene
        this.renderer.render(this.postprocessingScene, this.camera);
    };

    updateChildrenTree(elements) {
        while (this.scene.children.length) {
            this.scene.remove(this.scene.children[0]);
        }

        for (let i = 0; i < elements.length; i++) {
            this.addQuad(elements[i]);
        }
    }

    addQuad(element) {
        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshNormalMaterial();

        const quad = new Mesh(geometry, element.material || material);
        quad.userData.element = element;
        quad.userData.uid = element.uid;

        this.scene.add(quad);
    }

    scroll(x, y) {
        this.offset.x = x;
        this.offset.y = y;
    }

    resize() {
        // const zoom = document.documentElement.clientWidth / global.innerWidth;
        this.width = global.innerWidth * ratio;
        this.height = global.innerHeight * ratio;

        // update camera
        this.camera.left = -this.width * 0.5;
        this.camera.right = this.width * 0.5;
        this.camera.top = this.height * 0.5;
        this.camera.bottom = -this.height * 0.5;
        this.camera.updateProjectionMatrix();

        // update renderer
        this.renderer.setSize(this.width, this.height);
        this.renderer.domElement.style.width = `${this.width / ratio}px`;
        this.renderer.domElement.style.height = `${this.height / ratio}px`;

        for (let i = 0; i < this.scene.children.length; i++) {
            const { rectangle } = this.scene.children[i].userData.element;

            this.scene.children[i].scale.set(
                rectangle.width * ratio,
                rectangle.height * ratio,
                1
            );
        }

        // update postprocessing
        // Buffer texture
        this.bufferTexture.setSize(this.width, this.height);

        // Plane
        this.plane.scale.set(this.width, this.height, 1);
    }

    render() {
        return (
            <canvas
                ref={this.canvas}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: -1,
                    pointerEvents: 'none',
                }}
            />
        );
    }
}
