/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useRef, useEffect, useState } from 'react';
import { TextureLoader, LinearFilter } from 'three';
import { TweenLite } from 'gsap';
import { VFXImage } from 'app/components/vfx/elements';
import { getMobile } from 'app/constants';
import './style.scss';

export const ImageComponent = ({ src, alt }) => {
    const domElement = useRef();
    const slide = useRef();

    const path = src;
    const [texture, setTexture] = useState();

    const onComplete = () => {
        TweenLite.to(slide.current, 0.5, {
            opacity: 0,
            ease: 'Power2.easeOut',
            delay: Math.random() * 0.5,
            onComplete: () => {
                slide.current.style.pointerEvents = 'none';
            },
        });
    };

    useEffect(() => {
        // html or webgl
        if (getMobile()) {
            const img = new Image();
            img.onload = () => {
                domElement.current.appendChild(img);
                onComplete();
            };
            img.alt = alt;
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
        <div ref={domElement} className="image">
            {!getMobile() && texture && (
                <VFXImage texture={texture} alt={alt} hover />
            )}
            <div ref={slide} className="over" />
        </div>
    );
};
