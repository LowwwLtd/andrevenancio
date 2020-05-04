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
    Clock,
} from 'three';
import { TweenLite } from 'gsap';
import { post } from 'app/shaders/post-processing';
import { Context } from '../context';
import { getPageOffset } from '../utils';

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

        // scroll offset
        this.offset = new Vector2();

        // scroll speed
        this.scrollVelocity = 0;
        this.oldScrollTop = 0;
        this.scrollSpeed = 0;

        // mouse speed
        this.mouse = new Vector2();
        this.prevMouse = new Vector2();
        this.mouseTarget = new Vector2();
        this.mouseSpeed = 0;
        this.mouseTargetSpeed = 0;
    }

    componentDidMount() {
        this.setup();
        this.resize();
        this.update();

        // used to detect if we need to update our child tree
        this.prevContext = this.context;

        this.rebuildChildrenTree(this.context.elements);
    }

    componentDidUpdate() {
        document.body.addEventListener(
            'mousemove',
            this.handleMouseMove.bind(this),
            false
        );
        const same = compare(this.prevContext.elements, this.context.elements);
        this.prevContext = this.context;
        if (!same) {
            this.rebuildChildrenTree(this.context.elements);
        }
    }

    componentWillUnmount() {
        document.body.removeEventListener(
            'mousemove',
            this.handleMouseMove.bind(this),
            false
        );
        cancelAnimationFrame(this.raf);
    }

    setup() {
        const w = global.innerWidth * 0.5;
        const h = global.innerHeight * 0.5;

        this.renderer = new WebGLRenderer({
            canvas: this.canvas.current,
            antialias: false,
            alpha: true,
            premultipliedAlpha: true,
            preserveDrawingBufer: true,
        });

        this.postprocessingScene = new Scene();

        this.scene = new Scene();

        this.camera = new OrthographicCamera(-w, w, h, -h, 1, 10);
        this.camera.position.z = 1;

        this.clock = new Clock();

        // ----------------
        // post processing
        // ----------------
        this.bufferTexture = new WebGLRenderTarget(
            global.innerWidth,
            global.innerHeight,
            { minFilter: LinearFilter, magFilter: NearestFilter }
        );

        const geometry = new PlaneGeometry(1, 1);
        this.material = new ShaderMaterial(
            post({ texture: this.bufferTexture })
        );

        this.plane = new Mesh(geometry, this.material);
        this.plane.scale.set(global.innerWidth, global.innerHeight, 1);
        this.plane.material.needsUpdate = true;
        this.postprocessingScene.add(this.plane);
    }

    handleMouseMove(e) {
        this.mouseTarget.x = (e.clientX * ratio) / this.width;
        this.mouseTarget.y = 1 - (e.clientY * ratio) / this.height;
    }

    updateScroll() {
        // update scroll speed
        this.scrollVelocity = getPageOffset().y - this.oldScrollOffset;
        this.oldScrollOffset = getPageOffset().y;
        this.scrollSpeed += (this.scrollVelocity - this.scrollSpeed) / 4.0;
    }

    updateMouse() {
        // calculate mouse position with ease
        this.mouse.x += (this.mouseTarget.x - this.mouse.x) / 6.0;
        this.mouse.y += (this.mouseTarget.y - this.mouse.y) / 6.0;

        // calculate mouse speed
        this.mouseTargetSpeed = Math.sqrt(
            (this.prevMouse.x - this.mouseTarget.x) ** 2 +
                (this.prevMouse.y - this.mouseTarget.y) ** 2
        );

        this.mouseSpeed += (this.mouseTargetSpeed - this.mouseSpeed) / 20.0;

        this.prevMouse.x = this.mouseTarget.x;
        this.prevMouse.y = this.mouseTarget.y;
    }

    update(timestamp) {
        this.raf = requestAnimationFrame(this.update.bind(this));

        // update scroll and mouse calculations
        this.updateScroll();
        this.updateMouse();

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

            this.scene.children[i].position.set(x, y, 0);
            this.scene.children[
                i
            ].material.uniforms.iTime.value = this.clock.getElapsedTime();
        }

        this.postprocessing(timestamp);
    }

    postprocessing(timestamp) {
        // render to texture
        this.renderer.setRenderTarget(this.bufferTexture);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);

        // uniforms
        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
        this.material.uniforms.texture.value = this.bufferTexture.texture;
        this.material.uniforms.time.value = timestamp / 1000;
        this.material.uniforms.scrollSpeed.value =
            Math.abs(this.scrollVelocity) / 30; // 2;
        this.material.uniforms.scrollVelocity.value = this.scrollVelocity;
        this.material.uniforms.mouse.value.x = this.mouse.x;
        this.material.uniforms.mouse.value.y = this.mouse.y;
        this.material.uniforms.mouseSpeed.value = this.mouseSpeed; // 0.02;

        // render final scene
        this.renderer.render(this.postprocessingScene, this.camera);
    }

    addQuad(element) {
        if (element.type === 'image') {
            const geometry = new PlaneGeometry(1, 1);
            const material = new MeshNormalMaterial();

            const quad = new Mesh(geometry, element.material || material);
            quad.userData.element = element;
            quad.userData.uid = element.uid;

            this.scene.add(quad);
        }
    }

    rebuildChildrenTree(elements) {
        while (this.scene.children.length) {
            this.scene.remove(this.scene.children[0]);
        }

        for (let i = 0; i < elements.length; i++) {
            this.addQuad(elements[i]);
        }
    }

    /* --------------------------------------------
    CALLED FROM PARENT
    */
    scroll(x, y) {
        this.offset.x = x;
        this.offset.y = y;
    }

    hover() {
        TweenLite.to(this.material.uniforms.hover, 0.5, {
            value: 1,
            ease: 'Power2.easeInOut',
        });
    }

    out() {
        TweenLite.to(this.material.uniforms.hover, 0.5, {
            value: 0,
            ease: 'Power2.easeInOut',
        });
    }

    resize() {
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

        this.bufferTexture.setSize(this.width, this.height);
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
