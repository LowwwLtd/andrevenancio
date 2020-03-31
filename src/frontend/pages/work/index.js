import React from 'react';
import { Link } from 'react-router-dom';
import imageUrlBuilder from '@sanity/image-url';
import { client, GET_ALL_POSTS, useSanityFetch } from 'app/sanity';
import './style.scss';

export const WorkPage = () => {
    const { result } = useSanityFetch(GET_ALL_POSTS);
    return (
        <div className="work">
            <div className="work__content">
                {result &&
                    result.map(
                        ({
                            _id,
                            mainImage,
                            title = '',
                            slug = '',
                            _updatedAt = '',
                        }) => {
                            return (
                                <Link key={_id} to={`/work/${slug.current}`}>
                                    <img
                                        src={imageUrlBuilder(client)
                                            .image(mainImage)
                                            .url()}
                                        alt={`${title}`}
                                    />
                                    <div className="info">
                                        <div className="title">{title}</div>
                                        {false && (
                                            <div className="date">
                                                {new Date(
                                                    _updatedAt
                                                ).toDateString()}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        }
                    )}
            </div>
        </div>
    );
};
