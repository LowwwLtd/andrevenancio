import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextureLoader, LinearFilter, PlaneBufferGeometry, Mesh } from 'three';
import { hashCode, domSize2viewSize } from './utils';
import { paperMaterial } from './materials';
import { EffectContext } from './effect-context';
import { WebGLRenderer } from './webgl-renderer';
/*
    
    WebGL:
    
    This acts as the wrapper for all webGL.
    
*/
export class WebGL extends Component {
    static propTypes = {
        children: PropTypes.node,
    };

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
            scene,
        });

        // Once we have a scene start updating it.
        this.update();
    };

    // Set renderer
    setRenderer = renderer => {
        this.setState({
            renderer,
        });
    };

    // Add image
    // This pushes our image to our context & creates a webGL version.
    // As images load this will get called and they will be added.
    addImage = image => {
        const _image = {
            el: image,
            id: hashCode(`${image.src}_${Math.random()}`),
        };

        // Load the texture -
        // note this is coming from cache so shouldn't be much network wise.
        const loader = new TextureLoader();
        loader.crossOrigin = '*';
        loader.load(_image.el.src, imageBitmap => {
            const { elements, scene } = this.state;
            const texture = imageBitmap;
            texture.minFilter = LinearFilter;

            // Create geometry
            const geometry = new PlaneBufferGeometry(1, 1, 1, 1);

            // Create material
            const material = paperMaterial({
                texture,
                imageAspectRatio: _image.el.width / _image.el.height,
                aspectRatio: _image.el.offsetWidth / _image.el.offsetHeight,
            });

            _image.geoSize = domSize2viewSize(_image.el, this.viewSize);

            // Create Mesh
            const plane = new Mesh(geometry, material);

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
                elements,
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
                    elements,
                    scene,
                    renderer,
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
