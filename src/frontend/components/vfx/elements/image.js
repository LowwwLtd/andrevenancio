import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context';

export class VFXImage extends PureComponent {
    static contextType = Context;

    static propTypes = {
        src: PropTypes.string,
        alt: PropTypes.string,
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
        this.setState({
            added: true,
        });
        if (this.context) {
            this.context.add(this.domElement.current);
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
        return (
            <img
                ref={this.domElement}
                src={this.props.src}
                alt={this.props.alt || ''}
                onMouseEnter={this.onEnter}
                onMouseLeave={this.onLeave}
                style={{ opacity: this.context && this.state.added ? 0 : 1 }}
            />
        );
    }
}
