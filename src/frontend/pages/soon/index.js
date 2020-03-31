/* eslint-disable jsx-a11y/accessible-emoji */
import React, { PureComponent } from 'react';
import { debounce } from 'app/utils/debounce';
import { Canvas } from './backup';
import './style.scss';

export class SoonPage extends PureComponent {
    domElement = React.createRef();

    componentDidMount() {
        const context = this.domElement.current.getContext('2d');

        this.ratio = global.devicePixelRatio;

        this.canvas = new Canvas(context);
        this.resize();

        this.debounced = debounce(this.resize, 100);
        global.addEventListener('resize', this.debounced, false);
        global.addEventListener('mousemove', this.handleMove, false);

        this.raf = requestAnimationFrame(this.update);
    }

    componentWillUnmount() {
        global.removeEventListener('resize', this.debounced, false);
        global.removeEventListener('mousemove', this.handleMove, false);
        cancelAnimationFrame(this.raf);
    }

    handleMove = e => {
        if (this.canvas.test) {
            this.canvas.test(e.clientX * this.ratio, e.clientY * this.ratio);
        }
    };

    resize = () => {
        const width = global.innerWidth * this.ratio;
        const height = global.innerHeight * this.ratio;

        this.domElement.current.width = width;
        this.domElement.current.height = height;
        this.domElement.current.style.width = `${width / this.ratio}px`;
        this.domElement.current.style.height = `${height / this.ratio}px`;

        this.canvas.resize(width, height, this.ratio);
    };

    update = () => {
        this.raf = requestAnimationFrame(this.update);
        this.canvas.update();
    };

    render() {
        return (
            <div className="soon">
                {true && (
                    <div className="content">
                        <h1>Hello</h1>
                        <p>
                            I&apos;m André 👋, a Senior Creative Developer based
                            in London.
                        </p>
                    </div>
                )}

                <canvas ref={this.domElement} />
            </div>
        );
    }
}
