/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TextureLoader, LinearFilter } from 'three';
import { TweenLite } from 'gsap';
import imageUrl from '@sanity/image-url';
import { client } from 'app/sanity';
import { VFXImage } from 'app/components/vfx/elements';
import { MOBILE } from 'app/constants';
import './style.scss';

export const Thumbnail = ({ mainImage, title = '', slug = '' }) => {
    const domElement = useRef();
    const slide = useRef();

    const [texture, setTexture] = useState();
    const path = imageUrl(client)
        .image(mainImage)
        .crop('center')
        .fit('crop')
        .width(512)
        .height(512)
        .url();

    const onComplete = () => {
        TweenLite.to(slide.current, 0.5, {
            width: 0,
            ease: 'Power2.easeOut',
            delay: Math.random() * 0.5,
        });
    };

    useEffect(() => {
        // html or webgl
        if (MOBILE) {
            const img = new Image();
            img.onload = () => {
                domElement.current.appendChild(img);
                onComplete();
            };
            img.alt = title;
            img.src = path;
        } else {
            const loader = new TextureLoader();
            loader.crossOrigin = '*';
            loader.load(path, (imageBitmap) => {
                const t = imageBitmap;
                t.minFilter = LinearFilter;
                setTexture(t);
                onComplete();
            });
        }
    }, []);

    return (
        <Link to={`/work/${slug.current}`} className="thumbnail">
            <div ref={domElement} className="image">
                <div className="title noselect">{title}</div>
                {!MOBILE && texture && <VFXImage texture={texture} hover />}
                <div ref={slide} className="over" />
            </div>
        </Link>
    );
};
