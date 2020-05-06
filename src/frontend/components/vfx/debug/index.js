import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export class Debug extends PureComponent {
    static propTypes = {
        view: PropTypes.object,
        tree: PropTypes.array,
        debug: PropTypes.bool,
    };

    canvas = React.createRef();

    componentDidMount() {
        if (this.canvas.current) {
            this.ctx = this.canvas.current.getContext('2d');
            this.scale = 1;
        }
    }

    componentWillUnmount() {
        this.ctx = null;
    }

    resize(width, height) {
        if (this.canvas.current) {
            const ratio = global.devicePixelRatio || 1;
            const realWidth = width;
            const realHeight = height;
            const maxWidth = 100;

            this.scale = (maxWidth * ratio) / realWidth;

            const targetWidth = Math.round(realWidth * this.scale);
            const targetHeight = Math.round(realHeight * this.scale);

            this.canvas.current.width = targetWidth;
            this.canvas.current.height = targetHeight;
            this.canvas.current.style.width = `${targetWidth / ratio}px`;
            this.canvas.current.style.height = `${targetHeight / ratio}px`;
        }
    }

    draw() {
        if (this.canvas.current) {
            // this.resize();

            this.ctx.clearRect(
                0,
                0,
                this.canvas.current.width,
                this.canvas.current.height
            );

            // draw screen area
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#ccc';
            this.ctx.lineWidth = global.devicePixelRatio;
            this.ctx.rect(
                ~~(this.props.view.x * this.scale),
                ~~(this.props.view.y * this.scale),
                ~~(this.props.view.width * this.scale),
                ~~(this.props.view.height * this.scale)
            );
            this.ctx.stroke();

            // all quad's
            if (this.props.tree) {
                this.props.tree.forEach((element) => {
                    const { rectangle, inView } = element;

                    this.ctx.beginPath();
                    this.ctx.strokeStyle = inView ? '#0f0' : '#ff0';
                    this.ctx.rect(
                        ~~rectangle.x * this.scale,
                        ~~rectangle.y * this.scale,
                        ~~rectangle.width * this.scale,
                        ~~rectangle.height * this.scale
                    );
                    this.ctx.stroke();
                });
            }
        }
    }

    render() {
        if (this.props.debug) {
            return (
                <canvas
                    ref={this.canvas}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(0, 0, 0, 1)',
                        zIndex: 1000,
                    }}
                />
            );
        }

        return null;
    }
}
