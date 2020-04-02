/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { GET_ALL_POSTS, useSanityFetch } from 'app/sanity';
import { Thumbnail } from 'app/components/thumbnail';
import './style.scss';

export const WorkPage = () => {
    const { result } = useSanityFetch(GET_ALL_POSTS);
    console.log(GET_ALL_POSTS, result);
    return (
        <div className="work">
            <div className="work__content">
                {result &&
                    result.map(props => (
                        <Thumbnail key={props._id} {...props} />
                    ))}
            </div>
        </div>
    );
};
