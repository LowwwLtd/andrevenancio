import React from 'react';
import { Link } from 'react-router-dom';
import imageUrlBuilder from '@sanity/image-url';
import { client, GET_ALL_POSTS, useSanityFetch } from 'app/sanity';
import './style.scss';

export const HomePage = () => {
    const { result } = useSanityFetch(GET_ALL_POSTS);
    return (
        <div className="home">
            <div className="list">
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
                                <div key={_id} className="home__thumb">
                                    <Link to={`/post/${slug.current}`}>
                                        <img
                                            src={imageUrlBuilder(client)
                                                .image(mainImage)
                                                .url()}
                                            alt={`${title}`}
                                        />
                                        {title} (
                                        {new Date(_updatedAt).toDateString()})
                                    </Link>
                                </div>
                            );
                        }
                    )}
            </div>
        </div>
    );
};
