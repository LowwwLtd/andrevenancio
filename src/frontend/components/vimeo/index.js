/* eslint-disable jsx-a11y/iframe-has-title */
import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

export const Vimeo = ({ url }) => {
    const player = url.replace('vimeo.com/', 'player.vimeo.com/video/');
    return (
        <div className="embed-container">
            <iframe src={player} frameBorder="0" allowFullScreen />
        </div>
    );
};

Vimeo.propTypes = {
    url: PropTypes.string.isRequired,
};
