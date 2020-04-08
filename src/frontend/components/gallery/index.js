import React from 'react';
import PropTypes from 'prop-types';
import imageUrl from '@sanity/image-url';
import { client } from 'app/sanity';
import { VFXImage } from 'app/components/vfx/elements';

import './style.scss';

export const Gallery = ({ images = [] }) => {
    return (
        <div className="gallery">
            {images.map((image) => (
                <VFXImage
                    key={image._key}
                    src={imageUrl(client).image(image).url()}
                    alt={image.alt}
                />
            ))}
        </div>
    );
};

Gallery.propTypes = {
    images: PropTypes.array,
};
