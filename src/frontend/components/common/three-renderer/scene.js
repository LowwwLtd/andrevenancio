import {
    Scene as ThreeScene,
    OrthographicCamera,
    WebGLRenderer,
    WebGLRenderTarget,
    LinearFilter,
    NearestFilter,
    PlaneGeometry,
    Mesh,
} from 'three';
import {
    createImageWebGL,
    domPosition2viewPosition,
    domSize2viewSize,
} from './utils';
import { postProcessingMaterial } from './materials';

/*
  
    Scene:
    This is the guts of the webGL layer. Here we will:
    - create renderer
    - create camera
    - create buffer scene
    - create scene
    - manage webgl updates & rendering
  
*/
export class Scene {
    constructor() {
        this.scene = new ThreeScene();
        this.bufferScene = new ThreeScene();
    }

    // Basic THREEjs setup
    init = (canvasRef, ctx) => {
        this.canvasRef = canvasRef;
        this.ctx = ctx;
        this.width = global.innerWidth;
        this.height = global.innerHeight;

        this.viewSize = {
            height: 1,
            width: 1,
        };

        // Create an orthographic camera because we're rendering a flat plane vs perspective
        this.camera = new OrthographicCamera(
            -this.viewSize.width / 2,
            this.viewSize.width / 2,
            this.viewSize.height / 2,
            -this.viewSize.height / 2,
            -100,
            100
        );

        // Create the renderer
        this.renderer = new WebGLRenderer({
            canvas: this.canvasRef,
            antialias: true,
            alpha: true,
            premultipliedAlpha: true,
            preserveDrawingBufer: true,
        });

        // Set renderer size
        this.renderer.setSize(global.innerWidth, global.innerHeight);

        // expose the renderer in the context (so we can access the WebGLRendeingContext)
        this.ctx.setRenderer(this.renderer);

        // Create buffer scene
        this.bufferTexture = new WebGLRenderTarget(
            global.innerWidth,
            global.innerHeight,
            { minFilter: LinearFilter, magFilter: NearestFilter }
        );

        // Our post processing material
        const geometry = new PlaneGeometry(1, 1);
        this.postProcessingMaterial = postProcessingMaterial({
            texture: this.bufferTexture,
        });

        // Create a mesh for our postprocessing layer.
        this.plane = new Mesh(geometry, this.postProcessingMaterial);
        this.plane.scale.set(this.viewSize.width, this.viewSize.height, 1);
        this.plane.material.needsUpdate = true;
        this.scene.add(this.plane);
    };

    // Add image
    // As this creates the webGL verison of the image & allows us to render
    addImage = (image) => {
        createImageWebGL(image, this.viewSize, this.bufferScene);
    };

    // Example - if you wanted to add a video you would hook that here
    // addVideo = (video) => {}

    // Loop over all of our elements & update their position.
    // All elements will need their positions updated so we don't care about types here
    // In theory if you wanted to you could take specific action on types
    updateElements = () => {
        // const { elements } = this.ctx.elements;
        this.ctx.elements.forEach((element) => {
            if (element.plane.visible) {
                const newPosition = domPosition2viewPosition(
                    element.el,
                    this.viewSize,
                    element.geoSize
                );
                element.plane.position.x = newPosition.x;
                element.plane.position.y = newPosition.y;
            }
        });
    };

    resize = (width, height) => {
        // Dimensions
        this.width = width;
        this.height = height;

        // camera
        this.camera.left = -this.viewSize.width / 2;
        this.camera.right = this.viewSize.width / 2;
        this.camera.top = this.viewSize.height / 2;
        this.camera.bottom = -this.viewSize.height / 2;
        this.camera.updateProjectionMatrix();

        // Resize elements
        this.resizeElements();

        // Buffer texture
        this.bufferTexture.setSize(this.width, this.height);

        // Plane
        this.plane.scale.set(this.viewSize.width, this.viewSize.height, 1);

        // renderer
        this.renderer.setSize(global.innerWidth, global.innerHeight);
    };

    // Loop the elemtns and match their DOM counterparts
    resizeElements = () => {
        // const { elements } = this.ctx.elements;
        this.ctx.elements.forEach((element) => {
            element.geoSize = domSize2viewSize(element.el, this.viewSize);
            if (
                element.plane.material.uniforms &&
                element.plane.material.uniforms.aspectRatio
            ) {
                element.plane.material.uniforms.aspectRatio.value =
                    element.el.offsetWidth / element.el.offsetHeight;
            }
            element.plane.scale.set(
                element.geoSize.width || 0.00001,
                element.geoSize.height || 0.00001,
                1
            );
        });
    };

    // Render loop that updates elements & other things
    // Once updates are done we render everything
    render = () => {
        //if (this.width > 768) {
        this.updateElements();
        this.renderWebGl();
        //}
    };

    // Render the buffer scene into our main scene
    renderWebGl = () => {
        // render rendertarget
        this.renderer.setRenderTarget(this.bufferTexture);
        this.renderer.render(this.bufferScene, this.camera);
        this.postProcessingMaterial.uniforms.sceneTexture.value = this.bufferTexture.texture;
        this.renderer.setRenderTarget(null);

        // render final scene
        this.renderer.render(this.scene, this.camera);
    };
}
