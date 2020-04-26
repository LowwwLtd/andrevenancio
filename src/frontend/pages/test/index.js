/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { GET_ALL_POSTS, useSanityFetch } from 'app/sanity';
import { Thumbnail } from 'app/components/thumbnail';
import { VFXImage } from 'app/components/vfx/elements';
import './style.scss';

export const TestPage = () => {
    const { result } = useSanityFetch(GET_ALL_POSTS);
    return (
        <div className="test">
            <div className="test__content">
                {result &&
                    result.map((props) => (
                        <Thumbnail key={props._id} {...props} />
                    ))}
            </div>
            <VFXImage src="/img/test1.jpg" alt="imagem1" />
            <VFXImage src="/img/test2.jpg" alt="imagem1" />
            <VFXImage src="/img/test3.jpg" alt="imagem1" />
            <VFXImage src="/img/test4.jpg" alt="imagem1" />
        </div>
    );
};
