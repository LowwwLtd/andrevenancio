import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TweenMax } from 'gsap';

/*
USAGE:

<Transition location={location}>
    <Switch location={location}>
        {routes.map(route => (
            <Route
                key={`component-${route.path}`}
                path={route.path}
                exact={route.exact}
            >
                {route.child}
            </Route>
        ))}
    </Switch>
</Transition>
*/

export class Transition extends Component {
    static propTypes = {
        children: PropTypes.node,
        location: PropTypes.object,
        inDuration: PropTypes.number,
        inComplete: PropTypes.func,
        outDuration: PropTypes.number,
        outComplete: PropTypes.func,
    };

    static defaultProps = {
        inComplete: () => null,
        outComplete: () => null,
        inDuration: 0.5,
        outDuration: 0.5,
    };

    state = {
        previousChildren: null,
    };

    domElement = React.createRef();

    mask = React.createRef();

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.toggle(nextProps);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.previousChildren !== this.state.previousChildren) {
            if (this.state.previousChildren !== null) {
                this.out();
            } else {
                this.in();
            }
        }
    }

    toggle({ location }) {
        if (location.pathname !== this.props.location.pathname) {
            this.setState({
                previousChildren: this.props.children,
            });
        }
    }

    in() {
        TweenMax.fromTo(
            this.mask.current,
            this.props.inDuration,
            { top: 'initial', bottom: 0 },
            {
                height: '0%',
                ease: 'Power2.easeInOut',
                onComplete: () => {
                    this.inComplete();
                },
            }
        );
    }

    inComplete() {
        this.props.inComplete();
    }

    out() {
        TweenMax.fromTo(
            this.mask.current,
            this.props.outDuration,
            { top: 0, bottom: 'initial' },
            {
                height: '100%',
                ease: 'Power2.easeInOut',
                onComplete: () => {
                    global.scrollTo(0, 0);
                    this.outComplete();
                },
            }
        );
    }

    outComplete() {
        this.setState({
            previousChildren: null,
        });
        this.props.outComplete();
    }

    render() {
        const { children } = this.props;
        const { previousChildren } = this.state;
        return (
            <div
                ref={this.domElement}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                }}
            >
                <div
                    ref={this.mask}
                    style={{
                        position: 'fixed',
                        width: '100vw',
                        top: 0,
                        left: 0,
                        backgroundColor: '#151517',
                        pointerEvents: 'none',
                        zIndex: 1000,
                    }}
                />
                {previousChildren || children}
            </div>
        );
    }
}
