import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { css } from './utils';

export class ImageBlock extends PureComponent {
    static propTypes = {
        addImage: PropTypes.func,
        data: PropTypes.object,
    };

    domElement = React.createRef();

    state = {
        loaded: false,
    };

    componentDidMount() {
        this.domElement.current.addEventListener('load', this.onLoad);
    }

    componentWillUnmount() {
        this.domElement.current.removeEventListener('load', this.onLoad);
    }

    onLoad = () => {
        this.setState({
            loaded: true,
        });

        if (this.props.addImage) {
            this.props.addImage(this.domElement.current);
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
                    ref={(r) => {
                        this.domElement.current = r;
                    }}
                    alt="i"
                />
            </div>
        );
    }
}
