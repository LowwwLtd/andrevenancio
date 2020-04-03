import React, { PureComponent } from 'react';
import { EffectContext } from './effect-context';
import { Scene } from './scene';
import { WrapEffect } from './wrap-effect';

/*
    WebGLRenderer:
    
    This is where we create our scene, manage our shaders & update them.
    Think of this class as the data source for our scene / post processing / effects.
  
*/
export class WebGLRenderer extends PureComponent {
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
        global.addEventListener('scroll', this.onScroll);
        global.addEventListener('resize', this.onResize);

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
        this.width = global.innerWidth;
        this.height = global.innerHeight;
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
