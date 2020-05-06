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
import { getMobile } from 'app/constants';
import { Context } from './context';
import { Rectangle } from './rectangle';
import { Debug } from './debug';
import { setPageOffset, getElementRect } from './utils';
import { WebGL } from './webgl';

class VFXClass extends PureComponent {
    static propTypes = {
        children: PropTypes.node,
        debug: PropTypes.bool,
    };

    debug = React.createRef();

    webgl = React.createRef();

    andre = React.createRef();

    constructor(props) {
        super(props);

        this.view = new Rectangle(0, 0, global.innerWidth, global.innerHeight);
        this.state = {
            elements: [],
        };
    }

    componentDidMount() {
        this.raf = requestAnimationFrame(this.update);
        // global.addEventListener('scroll', this.handleScroll);
        global.addEventListener('resize', this.handleResize);
    }

    componentDidUpdate() {
        this.handleResize();
        // this.handleScroll();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.raf);
        // global.removeEventListener('scroll', this.handleScroll);
        global.removeEventListener('resize', this.handleResize);
    }

    // handleScroll = () => {
    //     // update view
    //     const { x, y } = getPageOffset();
    //     this.view.x = x;
    //     this.view.y = y;

    //     // check which elements are in view
    //     const elementsInView = this.state.elements.filter((element) => {
    //         const inView = element.rectangle.intersects(this.view);
    //         element.inView = inView;
    //         return inView;
    //     });

    //     // update transition elements in view
    //     elementsInView.forEach((element) => {
    //         if (element.type === 'dom') {
    //             element.react.scroll(
    //                 element.rectangle.y - y,
    //                 element.rectangle
    //             );
    //         }
    //     });

    //     if (this.debug.current) {
    //         this.debug.current.draw();
    //     }

    //     if (this.webgl.current) {
    //         this.webgl.current.scroll(x, y);
    //     }
    // };

    handleResize = () => {
        const { width, height } = this.andre.current.getBoundingClientRect();

        this.view.width = global.innerWidth;
        this.view.height = global.innerHeight;

        this.state.elements.forEach((element) => {
            const rect = getElementRect(element.domElement);
            element.rectangle.x = Math.round(rect.x);
            element.rectangle.y = Math.round(rect.y);
            element.rectangle.width = Math.round(rect.width);
            element.rectangle.height = Math.round(rect.height);
        });

        if (this.debug.current) {
            this.debug.current.resize(width, height);
            this.debug.current.draw();
        }

        if (this.webgl.current) {
            this.webgl.current.resize();
        }
    };

    update = (timestamp) => {
        // update view
        const { top, left } = this.andre.current.getBoundingClientRect();

        // set x, y
        setPageOffset(left, top);

        this.view.x = left;
        this.view.y = top * -1;

        // check which elements are in view
        const elementsInView = this.state.elements.filter((element) => {
            const inView = element.rectangle.intersects(this.view);
            element.inView = inView;
            return inView;
        });

        // update transition elements in view
        elementsInView.forEach((element) => {
            if (element.type === 'dom') {
                element.react.scroll(
                    element.rectangle.y + top,
                    element.rectangle
                );
            }
        });

        if (this.debug.current) {
            this.debug.current.draw();
        }

        if (this.webgl.current) {
            this.webgl.current.scroll(left, top * -1);
            this.webgl.current.update(timestamp);
        }

        this.raf = requestAnimationFrame(this.update);
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

    hover = (domElement, x, y) => {
        this.webgl.current.hover(x, y);
    };

    out = (domElement, x, y) => {
        this.webgl.current.out(x, y);
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
        return (
            <Context.Provider
                value={{
                    add,
                    remove,
                    hover,
                    out,
                    elements,
                }}
            >
                <div ref={this.andre}>
                    {this.props.children}
                    {!getMobile() && <WebGL ref={this.webgl} />}
                    <Debug
                        ref={this.debug}
                        debug={this.props.debug}
                        view={this.view}
                        tree={elements}
                    />
                </div>
            </Context.Provider>
        );
    }
}

export const VFX = withRouter(VFXClass);
