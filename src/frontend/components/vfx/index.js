/*
 - Page Transitions on react-router-dom change
 - Detect component in view (for anim in / out)
 - allows for webgl effects
*/

/*
This class should be at the application level.
Every special element gets added to an array, and can be accessed alongside some methods via a React.Context

each elements is checked against the screen coordinates and we only render objects that are in view
*/

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import mobile from 'is-mobile';
import { Context } from './context';
import { Rectangle } from './rectangle';
import { Debug } from './debug';
import { getPageOffset, getElementRect } from './utils';
import { WebGL } from './webgl';

const isMobile = mobile();

class VFXClass extends PureComponent {
    static propTypes = {
        children: PropTypes.node,
        debug: PropTypes.bool,
    };

    debug = React.createRef();

    webgl = React.createRef();

    constructor(props) {
        super(props);

        this.view = new Rectangle(0, 0, global.innerWidth, global.innerHeight);
        this.state = {
            elements: [],
        };
    }

    componentDidMount() {
        global.addEventListener('scroll', this.handleScroll);
        global.addEventListener('resize', this.handleResize);
    }

    componentDidUpdate() {
        this.handleResize();
        this.handleScroll();
    }

    componentWillUnmount() {
        global.removeEventListener('scroll', this.handleScroll);
        global.removeEventListener('resize', this.handleResize);
    }

    handleScroll = () => {
        // update view
        const { x, y } = getPageOffset();
        this.view.x = x;
        this.view.y = y;

        // check which elements are in view
        const keysInView = this.state.elements.filter((element) => {
            const inView = element.rectangle.intersects(this.view);
            element.inView = inView;
            return inView;
        });

        // update transition elements in view
        // keysInView.forEach((key) => {
        //     tree[key].transition.scroll(
        //         tree[key].rectangle.y - offset,
        //     );
        // });

        if (this.debug.current) {
            this.debug.current.draw();
        }

        if (this.webgl.current) {
            this.webgl.current.scroll(x, y);
        }
    };

    handleResize = () => {
        this.view.width = global.innerWidth;
        this.view.height = global.innerHeight;

        this.state.elements.forEach((element) => {
            const rect = getElementRect(element.domElement);
            element.rectangle.x = rect.x;
            element.rectangle.y = rect.y;
            element.rectangle.width = rect.width;
            element.rectangle.height = rect.height;
        });

        if (this.debug.current) {
            this.debug.current.resize();
            this.debug.current.draw();
        }

        if (this.webgl.current) {
            this.webgl.current.resize();
        }
    };

    add = (props) => {
        const element = {
            ...props,
            rectangle: new Rectangle(),
        };

        this.setState((prevState) => ({
            elements: prevState.elements.concat(element),
        }));
    };

    hover = (/* domElement, x, y */) => {
        // console.log('hover', domElement, x, y);
    };

    out = (/* domElement, x, y */) => {
        // console.log('out', domElement, x, y);
    };

    remove = (domElement) => {
        const found = this.state.elements.find(
            (e) => e.domElement === domElement
        );
        const index = this.state.elements.indexOf(found);
        if (index !== -1) {
            this.setState((prevState) => ({
                elements: prevState.elements.splice(index, 1),
            }));
        }
    };

    render() {
        const { add, remove, hover, out } = this;
        const { elements } = this.state;
        console.log('render', isMobile);
        return (
            <Context.Provider
                value={{
                    add,
                    remove,
                    hover,
                    out,
                    elements,
                    isMobile,
                }}
            >
                {this.props.children}
                {!isMobile && <WebGL ref={this.webgl} />}
                <Debug
                    ref={this.debug}
                    debug={this.props.debug}
                    view={this.view}
                    tree={elements}
                />
            </Context.Provider>
        );
    }
}

export const VFX = withRouter(VFXClass);
