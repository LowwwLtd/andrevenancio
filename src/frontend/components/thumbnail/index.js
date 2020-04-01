/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import imageUrlBuilder from '@sanity/image-url';
import { client } from 'app/sanity';
import { Loader } from 'app/components/loader';
import './style.scss';

export const Thumbnail = ({
    mainImage,
    title = '',
    slug = '',
    _updatedAt = '',
}) => {
    const domElement = useRef();
    const src = imageUrlBuilder(client)
        .image(mainImage)
        .crop('center')
        .fit('crop')
        .width(512)
        .height(512)
        .url();

    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setLoaded(true);
            domElement.current.appendChild(img);
        };
        img.alt = title;
        img.src = src;
    }, []);

    const classes = classnames({ thumbnail: true, loaded });
    return (
        <Link to={`/work/${slug.current}`} className={classes}>
            {!loaded && <Loader />}
            <div ref={domElement} className="image" />

            <div className="info">
                <div className="title">{title}</div>
                {false && (
                    <div className="date">
                        {new Date(_updatedAt).toDateString()}
                    </div>
                )}
            </div>
        </Link>
    );
};
