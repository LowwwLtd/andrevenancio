import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { css } from './utils';

export class ImageBlock extends PureComponent {
    static propTypes = {
        addImage: PropTypes.func,
        data: PropTypes.object,
    };

    state = {
        loaded: false,
    };

    componentDidMount() {
        this.ref.addEventListener('load', this.onLoad);
    }

    onLoad = () => {
        this.setState({
            loaded: true,
        });

        // If this component is part of a webGL element add the image
        if (this.props.addImage) {
            this.props.addImage(this.ref);
        }
    };

    render() {
        const { url } = this.props.data;
        const { loaded } = this.state;
        return (
            <div className={css('content-block', loaded && 'loaded')}>
                <img
                    src={url}
                    width="100%"
                    ref={r => {
                        this.ref = r;
                    }}
                    alt="i"
                />
            </div>
        );
    }
}
