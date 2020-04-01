/* eslint-disable jsx-a11y/iframe-has-title */
import React from 'react';
import './style.scss';

export const Vimeo = ({ url }) => {
    // {
    //     false && <Vimeo url="https://player.vimeo.com/video/402755677" />;
    // }
    return (
        <div className="embed-container">
            <iframe
                src={`${url}?autoplay=1&loop=1&background=1`}
                frameBorder="0"
                allowFullScreen
            />
        </div>
    );
};
