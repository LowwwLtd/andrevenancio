/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import { withRouter } from 'react-router-dom';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';
import { client, useSanityFetch, GET_POST } from 'app/sanity';
import { Vimeo } from 'app/components/vimeo';
import './style.scss';

const serializers = {
    types: {
        gallery: ({ node = {} }) => {
            return null;
            // return (
            //     <>
            //         {node.images.map(image => (
            //             <img
            //                 key={image._key}
            //                 src={imageUrlBuilder(client)
            //                     .image(image)
            //                     .width(200)
            //                     .url()}
            //                 alt={image.alt}
            //             />
            //         ))}
            //     </>
            // );
        },
    },
};

const workDetailClass = ({ match }) => {
    const { postId } = (match && match.params) || {};
    const { result } = useSanityFetch(GET_POST, { postId });

    const { title, info, body, technology, mainImage, vimeo } = result || {};
    console.log('main', mainImage);
    return (
        <article className="work-detail">
            <div className="work-detail__content">
                <div className="hero">
                    <img
                        src={imageUrlBuilder(client)
                            .image(mainImage)
                            .crop('center')
                            .fit('crop')
                            .width(256)
                            .height(256)
                            .url()}
                        alt={title}
                    />
                </div>
                <section>
                    <h1>{title}</h1>
                    {info && (
                        <div className="info">
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
                            {info.href && (
                                <div>
                                    <span>URL:</span>{' '}
                                    <a
                                        href={info.href}
                                        target="_blank"
                                        className="highlight"
                                        rel="noopener noreferrer"
                                    >
                                        {info.href}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                    {technology && (
                        <ul className="technology">
                            {technology.map(tech => (
                                <li key={tech}>{tech}</li>
                            ))}
                        </ul>
                    )}

                    {body && (
                        <div className="block">
                            <BlockContent
                                blocks={body}
                                imageOptions={{ w: 320, h: 240, fit: 'max' }}
                                serializers={serializers}
                                {...client.config()}
                            />
                        </div>
                    )}
                </section>
                {vimeo && <Vimeo url={vimeo} />}
            </div>
        </article>
    );
};

export const WorkDetailPage = withRouter(workDetailClass);
