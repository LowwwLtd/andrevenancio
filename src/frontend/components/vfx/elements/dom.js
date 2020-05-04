import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Context } from '../context';
import './style.scss';

let domID = 1000;

export class VFXDom extends PureComponent {
    static contextType = Context;

    static propTypes = {
        children: PropTypes.node,
    };

    domElement = React.createRef();

    elementInView = false;

    state = {
        transition: 'hidden',
    };

    componentDidMount() {
        if (this.context) {
            this.context.add({
                type: 'dom',
                uid: domID++,
                react: this,
                domElement: this.domElement.current,
            });
        }
    }

    componentWillUnmount() {
        if (this.context) {
            this.context.remove(this.domElement.current);
        }
    }

    scroll(offset, rectangle) {
        const triggerTop = 0 - rectangle.height;
        const triggerBottom = global.innerHeight - 0;

        const topAmount = rectangle.height * 0.5;
        const bottomAmount = rectangle.height * (1 - 0.5);

        if (
            offset > triggerTop + bottomAmount &&
            offset < triggerBottom - topAmount
        ) {
            if (this.elementInView === false) {
                this.elementInView = true;
                this.setState({ transition: 'visible' });
            }
        } else if (this.elementInView === true) {
            this.elementInView = false;
            this.setState({ transition: 'hidden' });
        }
    }

    render() {
        const classes = classnames({
            dom: true,
            [this.state.transition]: true,
        });
        return React.cloneElement(this.props.children, {
            className: classes,
            ref: this.domElement,
        });
    }
}
