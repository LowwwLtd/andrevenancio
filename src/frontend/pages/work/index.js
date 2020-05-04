/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { GET_ALL_POSTS, useSanityFetch } from 'app/sanity';
import { Thumbnail } from 'app/components/thumbnail';
import { VFXDom } from 'app/components/vfx/elements';
import './style.scss';

export const WorkPage = () => {
    const { result } = useSanityFetch(GET_ALL_POSTS);
    return (
        <div className="work">
            <section className="hello">
                <VFXDom>
                    <h1>Hello</h1>
                </VFXDom>
                <VFXDom>
                    <p>
                        I&apos;m André{' '}
                        <span role="img" aria-label="wave" className="wave">
                            👋🏻
                        </span>
                        , a Creative Developer based in London.
                    </p>
                </VFXDom>
            </section>
            <div className="work__content">
                {result &&
                    result.map((props) => (
                        <Thumbnail key={props._id} {...props} />
                    ))}
            </div>
        </div>
    );
};
