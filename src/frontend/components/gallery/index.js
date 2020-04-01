import React from 'react';
import PropTypes from 'prop-types';
import imageUrl from '@sanity/image-url';
import { client } from 'app/sanity';

import './style.scss';

export const Gallery = ({ images = [] }) => {
    return (
        <div className="gallery">
            {images.map(image => (
                <img
                    key={image._key}
                    src={imageUrl(client)
                        .image(image)
                        .url()}
                    alt={image.alt}
                />
            ))}
        </div>
    );
};

Gallery.propTypes = {
    images: PropTypes.array,
};
