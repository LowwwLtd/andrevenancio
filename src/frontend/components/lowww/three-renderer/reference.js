/* eslint-disable */

/*=======================================================================

 _    _ _     _     
| |  | | | (_) |    
| |  | | |_ _| |___ 
| |  | | __| | / __|
| |__| | |_| | \__ \
 \____/ \__|_|_|___/
 
=======================================================================*/
const css = (...args) => {
    let stylesList = [];

    args.filter(style => !!style) // remove any falsey values from our styles array and join our style classes.
        .forEach(style => {
            if (Array.isArray(style)) {
                stylesList = stylesList.concat(css(...style)); // Use recursion to handle nested array of styles.
            } else if (isString(style)) {
                stylesList.push(style); // Only add strings to our results
            }
        });

    return stylesList.join(' ');
};

const RandomNumber = () => {
    return Math.round(Math.random() * 100);
};

const isString = value => {
    return Object.prototype.toString.call(value) === '[object String]';
};

const domSize2viewSize = (el, viewSize = { width: 1, height: 1 }) => {
    return {
        width: (el.offsetWidth / window.innerWidth) * viewSize.width,
        height: (el.offsetHeight / window.innerHeight) * viewSize.height,
    };
};

const domPosition2viewPosition = (
    el,
    viewSize = { width: 1, height: 1 },
    geoSize
) => {
    geoSize = geoSize || domSize2viewSize(el, viewSize);
    const box = el.getBoundingClientRect();
    return {
        x:
            (box.left / window.innerWidth) * viewSize.width -
            viewSize.width / 2 +
            geoSize.width / 2,
        y:
            viewSize.height -
            (box.top / window.innerHeight) * viewSize.height -
            viewSize.height / 2 -
            geoSize.height / 2,
    };
};

const hashCode = s => {
    var h = 0,
        l = s.length,
        i = 0;
    if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
    return Math.abs(h);
};

const createImageWebGL = (image, viewSize, scene) => {
    let geoSize = domSize2viewSize(image.el, viewSize);
    const meshPosition = domPosition2viewPosition(image.el, viewSize, geoSize);

    image.plane.position.set(meshPosition.x, meshPosition.y, 0);
    image.plane.scale.set(
        geoSize.width || 0.00001,
        geoSize.height || 0.00001,
        1
    );
    image.plane.name = image.id;
    const group = new THREE.Object3D();
    group.name = image.id;
    image.group = group;
    group.add(image.plane);
    scene.add(group);

    return image;
};

/*=======================================================================
  
   ______  __  __          _       
  |  ____|/ _|/ _|        | |      
  | |__  | |_| |_ ___  ___| |_ ___ 
  |  __| |  _|  _/ _ \/ __| __/ __|
  | |____| | | ||  __/ (__| |_\__ \
  |______|_| |_| \___|\___|\__|___/
  
  =======================================================================*/

class WrapEffect {
    constructor(material) {
        this.material = material;
        this.oldScrollTop = 0;
        this.velocity = 0;
    }

    update = isScrolling => {
        // update velocity
        this.scrollingContainer =
            this.scrollingContainer ||
            document.scrollingElement ||
            document.documentElement;
        this.velocity =
            (window.scrollY || this.scrollingContainer.scrollTop) -
            this.oldScrollTop;
        this.oldScrollTop =
            window.scrollY || document.documentElement.scrollTop;

        // ease the effect velocity
        if (this.effectTween) {
            this.effectTween.kill();
        }
        if (
            this.velocity !== 0 ||
            this.material.uniforms.effectVelocity.value > 0.0
        ) {
            this.effectTween = TweenLite.to(this, 0.5, {
                effectVelocity: isScrolling ? Math.abs(this.velocity) / 50 : 0,
                onUpdate: () => {
                    this.material.uniforms.effectVelocity.value = this.effectVelocity;
                },
                ease: Power2.easeOut,
            });
        }
    };
}

/*=======================================================================
  
   _______ _            __  __                  
  |__   __| |          |  \/  |           (_)     
     | |  | |__   ___  | \  / | __ _  __ _ _  ___ 
     | |  | '_ \ / _ \ | |\/| |/ _` |/ _` | |/ __|
     | |  | | | |  __/ | |  | | (_| | (_| | | (__ 
     |_|  |_| |_|\___| |_|  |_|\__,_|\__, |_|\___|
                                      __/ |       
                                     |___/        
                                     
  =======================================================================*/

// Effect Context
// We will use EffectContext to create a shared context for our components
// This allows us to pass things from DOM to webGL.
const EffectContext = React.createContext();

/******************************
  
    Scene:
    This is the guts of the webGL layer. Here we will:
    - create renderer
    - create camera
    - create buffer scene
    - create scene
    - manage webgl updates & rendering
  
  ******************************/
class Scene {
    constructor() {
        this.scene = new THREE.Scene();
        this.bufferScene = new THREE.Scene();
    }

    // Basic THREEjs setup
    init = (canvasRef, ctx) => {
        this.canvasRef = canvasRef;
        this.ctx = ctx;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.viewSize = {
            height: 1,
            width: 1,
        };

        // Create an orthographic camera because we're rendering a flat plane vs perspective
        this.camera = new THREE.OrthographicCamera(
            -this.viewSize.width / 2,
            this.viewSize.width / 2,
            this.viewSize.height / 2,
            -this.viewSize.height / 2,
            -100,
            100
        );

        // Create the renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvasRef,
            antialias: true,
            alpha: true,
            premultipliedAlpha: true,
            preserveDrawingBufer: true,
        });

        // Set renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // expose the renderer in the context (so we can access the WebGLRendeingContext)
        this.ctx.setRenderer(this.renderer);

        // Create buffer scene
        this.bufferTexture = new THREE.WebGLRenderTarget(
            window.innerWidth,
            window.innerHeight,
            { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
        );

        // Our post processing material
        let geometry = new THREE.PlaneGeometry(1, 1);
        this.postProcessingMaterial = postProcessingMaterial({
            texture: this.bufferTexture,
        });

        // Create a mesh for our postprocessing layer.
        this.plane = new THREE.Mesh(geometry, this.postProcessingMaterial);
        this.plane.scale.set(this.viewSize.width, this.viewSize.height, 1);
        this.plane.material.needsUpdate = true;
        this.scene.add(this.plane);
    };

    // Add image
    // As this creates the webGL verison of the image & allows us to render
    addImage = image => {
        createImageWebGL(image, this.viewSize, this.bufferScene);
    };

    // Example - if you wanted to add a video you would hook that here
    //addVideo = (video) => {}

    // Loop over all of our elements & update their position.
    // All elements will need their positions updated so we don't care about types here
    // In theory if you wanted to you could take specific action on types
    updateElements = () => {
        const { elements } = this.ctx.elements;
        this.ctx.elements.forEach(element => {
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
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Loop the elemtns and match their DOM counterparts
    resizeElements = () => {
        const { elements } = this.ctx.elements;
        this.ctx.elements.forEach(element => {
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
        if (this.width > 768) {
            this.updateElements();
            this.renderWebGl();
        }
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

/******************************
  
    WebGLRenderer:
    
    This is where we create our scene, manage our shaders & update them.
    Think of this class as the data source for our scene / post processing / effects.
  
  ******************************/
class WebGLRenderer extends React.PureComponent {
    static contextType = EffectContext;
    constructor(props) {
        super(props);
        this.scene = new Scene();
    }

    componentDidMount() {
        // Initialize the scene
        this.scene.init(this.canvasRef, this.context);

        // Load the warp effect
        // These effects will drive your shaders / post processing
        this.WrapEffect = new WrapEffect(this.scene.postProcessingMaterial);

        // Listen for events & set scene
        window.addEventListener('scroll', this.onScroll);
        window.addEventListener('resize', this.onResize);

        // Set the scene and we're ready to roll
        this.context.setScene(this.scene);
    }

    // onScroll
    // When a scroll happens we want to send that to our effect to drive the shader
    // This simply checks if the scroll is happening & when complete it sets to false.
    onScroll = () => {
        // Update the warp effect
        this.isScrolling = true;
        this.WrapEffect.update(this.isScrolling);

        // Set a timeout and call false on scroll
        // This could use some cleanup but gets the idea across
        setTimeout(() => {
            this.isScrolling = false;
            this.WrapEffect.update(this.isScrolling);
        }, 0);
    };

    // onResize
    // Resize our webgl elements to match their DOM counterparts
    onResize = () => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.scene.resize(this.width, this.height);
    };

    render() {
        return (
            <div>
                <canvas
                    ref={r => {
                        this.canvasRef = r;
                    }}
                />
            </div>
        );
    }
}

/******************************
    
    WebGL:
    
    This acts as the wrapper for all webGL.
    
  ******************************/
class WebGL extends React.Component {
    state = {
        elements: [],
        renderer: null,
        scene: null,
    };

    // Basics
    componentDidMount() {
        this.viewSize = {
            height: 1,
            width: 1,
        };
    }

    // Set Scene
    setScene = scene => {
        this.setState({
            scene: scene,
        });

        // Once we have a scene start updating it.
        this.update();
    };

    // Set renderer
    setRenderer = renderer => {
        this.setState({
            renderer: renderer,
        });
    };

    // Add image
    // This pushes our image to our context & creates a webGL version.
    // As images load this will get called and they will be added.
    addImage = image => {
        let _image = {
            el: image,
            id: hashCode(`${image.src}_${Math.random()}`),
        };

        // Load the texture -
        // note this is coming from cache so shouldn't be much network wise.
        let loader = new THREE.TextureLoader();
        loader.crossOrigin = '*';
        loader.load(_image.el.src, imageBitmap => {
            let { elements, scene } = this.state;
            let texture = imageBitmap;
            texture.minFilter = THREE.LinearFilter;

            // Create geometry
            let geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);

            // Create material
            let material = paperMaterial({
                texture: texture,
                imageAspectRatio: _image.el.width / _image.el.height,
                aspectRatio: _image.el.offsetWidth / _image.el.offsetHeight,
            });

            _image.geoSize = domSize2viewSize(_image.el, this.viewSize);

            // Create Mesh
            const plane = new THREE.Mesh(geometry, material);

            // This is a hack for performance.
            // For one frame we need to render the mesh then cull it.
            // This means the mesh is not rendered until it is visible
            // This helps with perf, but requires at least one frame.
            plane.frustumCulled = false;
            requestAnimationFrame(() => {
                plane.frustumCulled = true;
            });

            // Update the _image object
            _image.texture = texture;
            _image.material = material;
            _image.plane = plane;

            // Add to the scene
            scene.addImage(_image);

            // Push to our elements array
            elements.push(_image);

            // Update the state
            this.setState({
                elements: elements,
            });
        });
    };

    // Update will render the scene & any other things you want to do on rAF
    update() {
        requestAnimationFrame(() => {
            this.state.scene.render();
            this.update();
        });
    }

    // We wrap everything in our Effect context provider
    render() {
        const { children } = this.props;
        const { elements, scene, renderer } = this.state;
        return (
            <EffectContext.Provider
                value={{
                    elements: elements,
                    scene: scene,
                    setScene: this.setScene,
                    setRenderer: this.setRenderer,
                    addImage: this.addImage,
                }}
            >
                {children}
                <WebGLRenderer />
            </EffectContext.Provider>
        );
    }
}

/******************************
    
    WebGLElement:
    
    This component acts as the glue between the webGL context & the DOM
    It has a simple switch statement to evaluate the type of component
    that needs to be rendered.
    
    That component should deal with normal props but also make use of 
    EffectContext methods.
    
    This sample is for images but you could easily add other elements.
    
  ******************************/
class WebGLElement extends React.PureComponent {
    // Switch to check the type:
    // this could be expanded to include other elements
    getComponent(contextValues, props) {
        switch (props.type) {
            case 'image':
                return <ImageBlock {...contextValues} {...props} />;
                break;
            case 'example-image':
                return <ExampleImage {...contextValues} {...props} />;
                break;
            default:
                return false;
                break;
        }
    }

    render() {
        return (
            <EffectContext.Consumer>
                {contextValues =>
                    this.getComponent({ ...contextValues }, this.props)
                }
            </EffectContext.Consumer>
        );
    }
}

/******************************
   
   Components
   The idea here is that comonents could be included as a webgl element or not
   These components should be dumb and have no concept of the rest of the app.
   
  ******************************/

// Image Block
class ImageBlock extends React.PureComponent {
    state = {
        loaded: false,
    };

    componentDidMount() {
        this.ref.addEventListener('load', this.onLoad);
    }

    onLoad = () => {
        this.setState({
            loaded: true,
        });

        // If this component is part of a webGL element add the image
        if (this.props.addImage) {
            this.props.addImage(this.ref);
        }
    };

    render() {
        const { title, url, copy } = this.props.data;
        const { loaded } = this.state;
        return (
            <div className={css('content-block', loaded && 'loaded')}>
                <img
                    src={`${url}`}
                    width="100%"
                    ref={r => {
                        this.ref = r;
                    }}
                />
                <Headline copy={title} />
                {copy != '' && <p>{copy}</p>}
            </div>
        );
    }
}

class ExampleImage extends React.PureComponent {
    state = {
        loaded: false,
    };

    componentDidMount() {
        this.ref.addEventListener('load', this.onLoad);
    }

    onLoad = () => {
        this.setState({
            loaded: true,
        });

        // If this component is part of a webGL element add the image
        if (this.props.addImage) {
            this.props.addImage(this.ref);
        }
    };

    render() {
        const { url } = this.props.data;
        const { loaded } = this.state;
        return (
            <div className={css('image-block', loaded && 'loaded')}>
                <img
                    src={`${url}`}
                    width="100%"
                    ref={r => {
                        this.ref = r;
                    }}
                />
            </div>
        );
    }
}

// Headline
const Headline = ({ copy }) => {
    return <h1>{copy}</h1>;
};

/******************************
   
   Main View
   Just a basic setup with some data
   
   To Note:
   We are using a WebGLElement component - you can read more above to get more
   details as to what it does but TL;DR it:
   - Checks the type
   - Renders the react component
   - Wraps & creates a WebGL version
   
  ******************************/
const App = () => {
    const data = {
        images: [
            {
                title: 'How it works',
                url:
                    'https://dom-to-webgl.s3.amazonaws.com/nadine-shaabana-3YYiDD_4Xg4.jpg',
                copy:
                    "Under the hood we are taking normal react components and rendering those first. Then we have another component that wraps specific elements and recreates them in webgl using their position & color / texture for the mesh. The original DOM element is at opacity 0 so it's technically always there and we can use it when needed as a fallback.",
            },
            {
                title: 'Fallbacks',
                url:
                    'https://dom-to-webgl.s3.amazonaws.com/bruno-cervera-JP8HPBcmWO0.jpg',
                copy:
                    "Some devices might not support specific features you're using, or maybe performance isn't great - or maybe the design calls for more static elements on mobile. Either way you always have a fallback and can easily switch off the webgl layer and re-enable the original DOM element.",
            },
            {
                title: 'Other possibilities',
                url:
                    'https://dom-to-webgl.s3.amazonaws.com/alex-simpson-e8kYjCQctr4.jpg',
                copy:
                    'This is kept simple for this example but the principals are the same and can be applied to many things including other DOM elements like divs, text, videos.',
            },
            {
                title: 'Learn more',
                url:
                    'https://dom-to-webgl.s3.amazonaws.com/alexander-pozdeev-uGVQ3Qing0s.jpg',
                copy:
                    'Finishing up an article that will go into more details about this feature as well as the rest of the tech details for the new Firstborn.com - stay tuned!',
            },
        ],
        examples: [
            {
                url:
                    'https://dom-to-webgl.s3.amazonaws.com/luke-witter-4D7-9lVUvNY.jpg',
            },
            {
                url:
                    'https://dom-to-webgl.s3.amazonaws.com/william-navarro-QpgISxTjsqY.jpg',
            },
            {
                url:
                    'https://dom-to-webgl.s3.amazonaws.com/markus-spiske-j2yvpBdmGyg.jpg',
            },
        ],
    };
    return (
        <WebGL>
            <Headline copy={`DOM to webGL`} />
            <div id="intro">
                For the new{' '}
                <a href="https://www.firstborn.com" target="_blank">
                    Firstborn.com
                </a>{' '}
                We decided to revisit a concept that isn't really new, and in
                fact we did it all the way{' '}
                <a
                    href="https://medium.com/@VilledieuMorgan/mountaindew-x-titanfall-technical-review-35f1be4089c"
                    target="_blank"
                >
                    back in 2016
                </a>{' '}
                - but what is new are the tools available. This Pen is a sample
                of how we approached taking DOM elements and recreating them in
                webGl. I've tried to document the code so you can follow along!
                <br />
                <br />
                Note: Sometimes it seems codepen runs into CORS issues with
                loading images from assets, if you don't see images load try to
                clear cache / refresh again.
            </div>
            {data.images.map(contentBlock => {
                return <WebGLElement type="image" data={contentBlock} />;
            })}
            <div className={`grid`}>
                {data.examples.map(image => {
                    return <WebGLElement type="example-image" data={image} />;
                })}
            </div>
        </WebGL>
    );
};

// Kick it off
ReactDOM.render(<App />, document.getElementById('app'));
