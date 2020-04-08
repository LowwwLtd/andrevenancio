/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { Context } from './context';
import { ImageBlock } from './image-block';

export class WebGLElement extends PureComponent {
    // Switch to check the type:
    // this could be expanded to include other elements
    getComponent(contextValues, props) {
        switch (props.type) {
            case 'image':
                return <ImageBlock {...contextValues} {...props} />;
            default:
                return false;
        }
    }

    render() {
        return (
            <Context.Consumer>
                {(contextValues) =>
                    this.getComponent({ ...contextValues }, this.props)
                }
            </Context.Consumer>
        );
    }
}
