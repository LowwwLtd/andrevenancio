/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import imageUrl from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';
import { client, useSanityFetch, GET_POST } from 'app/sanity';
import { Vimeo } from 'app/components/vimeo';
import { Gallery } from 'app/components/gallery';
import { VFXImage } from 'app/components/vfx/elements';
import './style.scss';

const serializers = {
    types: {},
};

const workDetailClass = ({ match }) => {
    const { postId } = (match && match.params) || {};
    const { result } = useSanityFetch(GET_POST, { postId });

    useEffect(() => {
        global.scrollTo(0, 0);
    }, []);

    const { title, info, body, technology, mainImage, gallery, vimeo } =
        result || {};
    return (
        <article className="work-detail">
            <div className="work-detail__content">
                <div className="hero">
                    <VFXImage
                        src={imageUrl(client).image(mainImage).url()}
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

                            <div>
                                {info.href && (
                                    <a
                                        href={info.href}
                                        target="_blank"
                                        className="url"
                                        rel="noopener noreferrer"
                                    >
                                        Launch Project
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                    {technology && (
                        <ul className="technology">
                            {technology.map((tech) => (
                                <li key={tech}>{tech}</li>
                            ))}
                        </ul>
                    )}

                    {body && (
                        <div className="block">
                            <BlockContent
                                blocks={body}
                                serializers={serializers}
                                {...client.config()}
                            />
                        </div>
                    )}
                </section>
                {gallery && <Gallery images={gallery.images} />}
                {vimeo && <Vimeo url={vimeo} />}
            </div>
        </article>
    );
};

export const WorkDetailPage = withRouter(workDetailClass);
