/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { EffectContext } from './effect-context';
import { ImageBlock } from './image-block';
import { ExampleImage } from './example-image';

export class WebGLElement extends PureComponent {
    // Switch to check the type:
    // this could be expanded to include other elements
    getComponent(contextValues, props) {
        switch (props.type) {
            case 'image':
                return <ImageBlock {...contextValues} {...props} />;
            case 'example-image':
                return <ExampleImage {...contextValues} {...props} />;
            default:
                return false;
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
