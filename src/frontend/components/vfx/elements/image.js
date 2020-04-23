import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ShaderMaterial, TextureLoader, LinearFilter } from 'three';
import { TweenLite } from 'gsap';
import { basic } from 'app/shaders/basic';
import { Context } from '../context';

export class VFXImage extends PureComponent {
    static contextType = Context;

    static propTypes = {
        src: PropTypes.string,
        alt: PropTypes.string,
        hover: PropTypes.bool,
    };

    domElement = React.createRef();

    state = {
        added: false,
    };

    componentDidMount() {
        this.domElement.current.addEventListener('load', this.onLoad);
    }

    componentWillUnmount() {
        this.domElement.current.removeEventListener('load', this.onLoad);
        if (this.context) {
            this.context.remove(this.domElement.current);
        }
    }

    onLoad = () => {
        // Once image loads, we create a texture loader
        const loader = new TextureLoader();
        loader.crossOrigin = '*';
        loader.load(this.props.src, (imageBitmap) => {
            const texture = imageBitmap;
            texture.minFilter = LinearFilter;

            this.material = new ShaderMaterial(basic({ texture }));
            this.material.uniforms.hover.value = this.props.hover ? 0 : 1;

            this.setState({
                added: true,
            });

            if (this.context) {
                this.context.add({
                    uid: this.material.uuid,
                    domElement: this.domElement.current,
                    material: this.material,
                });
            }
        });
    };

    onEnter = (e) => {
        if (this.props.hover) {
            const { clientX, clientY } = e.nativeEvent;
            if (this.context) {
                this.context.hover(this.domElement.current, clientX, clientY);
            }

            // update shader
            if (this.material && this.props.hover) {
                TweenLite.to(this.material.uniforms.hover, 1, {
                    value: 1,
                    ease: 'Linear.easeNone',
                });
            }
        }
    };

    onLeave = (e) => {
        if (this.props.hover) {
            const { clientX, clientY } = e.nativeEvent;
            if (this.context) {
                this.context.out(this.domElement.current, clientX, clientY);
            }
            // update shader
            if (this.material && this.props.hover) {
                TweenLite.to(this.material.uniforms.hover, 1, {
                    value: 0,
                    ease: 'Linear.easeNone',
                });
            }
        }
    };

    render() {
        return (
            <img
                ref={this.domElement}
                src={this.props.src}
                alt={this.props.alt || ''}
                onMouseEnter={this.onEnter}
                onMouseLeave={this.onLeave}
                style={{
                    opacity:
                        this.context &&
                        !this.context.isMobile &&
                        this.state.added
                            ? 0
                            : 1,
                }}
            />
        );
    }
}
