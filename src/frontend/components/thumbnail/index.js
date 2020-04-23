/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import imageUrl from '@sanity/image-url';
import { client } from 'app/sanity';
import { VFXImage } from 'app/components/vfx/elements';
import './style.scss';

export const Thumbnail = ({ mainImage, title = '', slug = '' }) => {
    const domElement = useRef();
    const src = imageUrl(client)
        .image(mainImage)
        .crop('center')
        .fit('crop')
        .width(512)
        .height(512)
        .url();

    const classes = classnames({ thumbnail: true });
    return (
        <Link to={`/work/${slug.current}`} className={classes}>
            <div ref={domElement} className="image">
                <div className="title">{title}</div>
                <VFXImage src={src} hover />
            </div>
        </Link>
    );
};
