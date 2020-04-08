import React, { PureComponent } from 'react';
import {
    OrthographicCamera,
    Scene,
    WebGLRenderer,
    PlaneGeometry,
    Mesh,
    MeshNormalMaterial,
    Vector2,
} from 'three';
import { Context } from '../context';

const ratio = 1; // global.devicePixelRatio;

export class WebGL extends PureComponent {
    static contextType = Context;

    canvas = React.createRef();

    constructor(props) {
        super(props);

        this.update.bind(this);
        this.offset = new Vector2();
    }

    componentDidMount() {
        this.setup();
        this.resize();
        this.update();
        this.updateChildren();
    }

    componentDidUpdate() {
        this.updateChildren();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.raf);
    }

    setup() {
        const w = global.innerWidth * 0.5;
        const h = global.innerHeight * 0.5;

        this.renderer = new WebGLRenderer({
            canvas: this.canvas.current,
            antialias: false,
            alpha: true,
        });

        this.scene = new Scene();

        this.camera = new OrthographicCamera(-w, w, h, -h, 1, 10);
        this.camera.position.z = 1;
    }

    update = () => {
        this.raf = requestAnimationFrame(this.update);

        // add offset to position
        for (let i = 0; i < this.scene.children.length; i++) {
            const { rectangle } = this.scene.children[i].userData.element;

            this.scene.children[i].position.set(
                rectangle.x +
                    this.offset.x +
                    rectangle.width / 2 -
                    this.width / 2,
                (rectangle.y -
                    this.offset.y +
                    rectangle.height / 2 -
                    this.height / 2) *
                    -1,
                0
            );
        }

        this.renderer.render(this.scene, this.camera);
    };

    updateChildren() {
        // remove all quads
        while (this.scene.children.length) {
            this.scene.remove(this.scene.children[0]);
        }

        // add all new quads
        for (let i = 0; i < this.context.elements.length; i++) {
            this.addQuad(this.context.elements[i]);
        }
    }

    addQuad(element) {
        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshNormalMaterial(); // new ShaderMaterial(shader);
        const quad = new Mesh(geometry, material);
        quad.userData.element = element;

        this.scene.add(quad);
    }

    scroll(x, y) {
        this.offset.x = x;
        this.offset.y = y;
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
                rectangle.width,
                rectangle.height,
                1
            );
            // converts dom position to threejs position
            this.scene.children[i].position.set(
                rectangle.x +
                    this.offset.x +
                    rectangle.width / 2 -
                    this.width / 2,
                (rectangle.y -
                    this.offset.y +
                    rectangle.height / 2 -
                    this.height / 2) *
                    -1,
                0
            );
        }
    }

    render() {
        return (
            <canvas
                ref={this.canvas}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    pointerEvents: 'none',
                }}
            />
        );
    }
}
