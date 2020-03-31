/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import { withRouter } from 'react-router-dom';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';
import { client, useSanityFetch, GET_POST } from 'app/sanity';
import './style.scss';

const serializers = {
    types: {
        gallery: ({ node = {} }) => {
            return (
                <ul>
                    {node.images.map(image => (
                        <li key={image._key}>
                            <img
                                src={imageUrlBuilder(client)
                                    .image(image)
                                    .width(200)
                                    .url()}
                                alt={image.alt}
                            />
                        </li>
                    ))}
                </ul>
            );
        },
    },
};

const workDetailClass = ({ match }) => {
    const { postId } = (match && match.params) || {};
    const { result } = useSanityFetch(GET_POST, { postId });

    const { title, info, body, technology } = result || {};
    return (
        <article className="work-detail">
            <div className="work-detail__content">
                <h1 className="spacer-l">{title}</h1>
                {info && (
                    <div className="spacer-m info">
                        <div>
                            <span>Client:</span>{' '}
                            <span className="highlight">{info.client}</span>{' '}
                        </div>
                        <div>
                            <span>Agency:</span>{' '}
                            <span className="highlight">{info.agency}</span>
                        </div>
                        <div>
                            <span>Year:</span>{' '}
                            <span className="highlight">{info.year}</span>{' '}
                        </div>
                        <div>
                            <span>Role:</span>{' '}
                            <span className="highlight">{info.role}</span>{' '}
                        </div>
                    </div>
                )}
                {technology && (
                    <ul className="spacer-xl">
                        {technology.map(tech => (
                            <li key={tech}>{tech}</li>
                        ))}
                    </ul>
                )}
                {body && (
                    <BlockContent
                        blocks={body}
                        imageOptions={{ w: 320, h: 240, fit: 'max' }}
                        serializers={serializers}
                        {...client.config()}
                    />
                )}
            </div>
        </article>
    );
};

export const WorkDetailPage = withRouter(workDetailClass);
