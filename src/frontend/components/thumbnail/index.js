/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TweenLite } from 'gsap';
import classnames from 'classnames';
import imageUrl from '@sanity/image-url';
import { client } from 'app/sanity';
import { Loader } from 'app/components/loader';
import './style.scss';

export const Thumbnail = ({ mainImage, title = '', slug = '' }) => {
    const domElement = useRef();
    const mask = useRef();
    const src = imageUrl(client)
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
            domElement.current.appendChild(img);

            mask.current.style = 'clip-path: inset(0 0 0 0)';
            const tween = { value: 0 };
            TweenLite.fromTo(
                tween,
                1,
                {
                    value: 0,
                },
                {
                    value: 100,
                    delay: Math.random() * 0.5,
                    ease: 'Power2.easeInOut',
                    onUpdate: () => {
                        mask.current.style = `clip-path: inset(0 0 0 ${tween.value}%)`;
                    },
                    onComplete: () => {
                        setLoaded(true);
                    },
                }
            );
        };
        img.alt = title;
        img.src = src;
    }, []);

    const classes = classnames({ thumbnail: true, loaded });
    return (
        <Link to={`/work/${slug.current}`} className={classes}>
            {!loaded && (
                <div ref={mask} className="mask">
                    <Loader />
                </div>
            )}
            <div ref={domElement} className="image">
                <div className="title">{title}</div>
            </div>
        </Link>
    );
};
