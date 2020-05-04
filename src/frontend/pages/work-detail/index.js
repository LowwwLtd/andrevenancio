/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import imageUrl from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';
import { client, useSanityFetch, GET_POST } from 'app/sanity';
import { VFXDom } from 'app/components/vfx/elements';
import { Gallery } from 'app/components/gallery';
import { ImageComponent } from 'app/components/image';
import { Footer } from 'app/components/footer';
import './style.scss';

const serializers = {
    types: {},
};

const parseBlock = (blocks) => {
    return blocks.map((block) => {
        return block.children.map((c) => {
            return (
                <VFXDom key={c._key}>
                    <p>{c.text}</p>
                </VFXDom>
            );
        });
    });
};

const workDetailClass = ({ match }) => {
    const { postId } = (match && match.params) || {};
    const { result } = useSanityFetch(GET_POST, { postId });

    useEffect(() => {
        global.scrollTo(0, 0);
    }, []);

    if (!result) {
        return null;
    }

    const { title, info, body, technology, mainImage, gallery, vimeo } =
        result || {};

    return (
        <>
            <article className="work-detail">
                <div className="work-detail__content">
                    <div className="hero">
                        <ImageComponent
                            src={imageUrl(client)
                                .image(mainImage)
                                .width(1440)
                                .url()}
                            alt={title}
                        />
                    </div>
                    <section>
                        <VFXDom>
                            <h1>{title}</h1>
                        </VFXDom>
                        {info && (
                            <div className="info">
                                <VFXDom>
                                    <div>
                                        <span>Client:</span>{' '}
                                        <span className="highlight">
                                            {info.client}
                                        </span>{' '}
                                    </div>
                                </VFXDom>

                                <VFXDom>
                                    <div>
                                        <span>Agency:</span>{' '}
                                        <span className="highlight">
                                            {info.agency}
                                        </span>
                                    </div>
                                </VFXDom>

                                <VFXDom>
                                    <div>
                                        <span>Year:</span>{' '}
                                        <span className="highlight">
                                            {info.year}
                                        </span>{' '}
                                    </div>
                                </VFXDom>

                                <VFXDom>
                                    <div>
                                        <span>Role:</span>{' '}
                                        <span className="highlight">
                                            {info.role}
                                        </span>{' '}
                                    </div>
                                </VFXDom>

                                <VFXDom>
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
                                        {vimeo && (
                                            <a
                                                href={vimeo}
                                                target="_blank"
                                                className="url vimeo"
                                                rel="noopener noreferrer"
                                            >
                                                Vimeo
                                            </a>
                                        )}
                                    </div>
                                </VFXDom>
                            </div>
                        )}
                        {technology && (
                            <VFXDom>
                                <ul className="technology">
                                    {technology.map((tech) => (
                                        <li key={tech}>{tech}</li>
                                    ))}
                                </ul>
                            </VFXDom>
                        )}

                        {body && false && (
                            <div className="block">
                                <BlockContent
                                    blocks={body}
                                    serializers={serializers}
                                    {...client.config()}
                                />
                            </div>
                        )}
                        {body && (
                            <div className="block">{parseBlock(body)}</div>
                        )}
                    </section>
                    {gallery && <Gallery images={gallery.images} />}
                </div>
            </article>
            <Footer client={info.client} />
        </>
    );
};

export const WorkDetailPage = withRouter(workDetailClass);
