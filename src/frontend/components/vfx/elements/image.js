import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ShaderMaterial } from 'three';
import { basic } from 'app/shaders/basic';
import { Context } from '../context';

export class VFXImage extends PureComponent {
    static contextType = Context;

    static propTypes = {
        texture: PropTypes.object,
        alt: PropTypes.string,
    };

    domElement = React.createRef();

    componentDidMount() {
        this.domElement.current.addEventListener('load', this.handleLoad);
    }

    componentWillUnmount() {
        this.domElement.current.removeEventListener('load', this.handleLoad);
        if (this.context) {
            this.context.remove(this.domElement.current);
        }
    }

    handleLoad = () => {
        const { texture } = this.props;
        this.material = new ShaderMaterial(basic({ texture }));

        if (this.context) {
            this.context.add({
                type: 'image',
                uid: this.material.uuid,
                domElement: this.domElement.current,
                material: this.material,
            });
        }
    };

    onEnter = (e) => {
        const { clientX, clientY } = e.nativeEvent;
        if (this.context) {
            this.context.hover(this.domElement.current, clientX, clientY);
        }
    };

    onLeave = (e) => {
        const { clientX, clientY } = e.nativeEvent;
        if (this.context) {
            this.context.out(this.domElement.current, clientX, clientY);
        }
    };

    render() {
        if (this.props.texture) {
            return (
                <img
                    ref={this.domElement}
                    src={this.props.texture.image.src}
                    alt={this.props.alt}
                    onMouseEnter={this.onEnter}
                    onMouseLeave={this.onLeave}
                    className="noselect"
                    style={{
                        opacity: 0,
                    }}
                />
            );
        }

        return null;
    }
}
