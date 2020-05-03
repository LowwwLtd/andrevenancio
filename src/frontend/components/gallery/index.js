import React from 'react';
import PropTypes from 'prop-types';
import imageUrl from '@sanity/image-url';
import { client } from 'app/sanity';
import { ImageComponent } from 'app/components/image';

import './style.scss';

export const Gallery = ({ images = [] }) => {
    return (
        <div className="gallery">
            {images.map((image) => (
                <ImageComponent
                    key={image._key}
                    src={imageUrl(client).image(image).width(1440).url()}
                    alt={image.alt || 'gallery'}
                />
            ))}
        </div>
    );
};

Gallery.propTypes = {
    images: PropTypes.array,
};
