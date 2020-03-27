/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { client, useSanityFetch, GET_POST } from 'app/sanity';

// https://github.com/satya164/react-simple-code-editor

const serializers = {
    types: {
        code: ({ node = {} }) => {
            return (
                <SyntaxHighlighter language={node.language}>
                    {node.code}
                </SyntaxHighlighter>
            );
        },
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

const postPageClass = ({ match }) => {
    const { postId } = match.params;
    const { result } = useSanityFetch(GET_POST, { postId });

    const { title, name, categories, body, authorImage } = result || {};

    return (
        <article>
            <Link to="/">Go Back</Link>
            <h1>{title}</h1>
            <span>By Author {name}</span>
            {authorImage && (
                <div>
                    <img
                        alt={name}
                        src={imageUrlBuilder(client)
                            .image(authorImage)
                            .width(100)
                            .url()}
                    />
                </div>
            )}
            {categories && (
                <ul>
                    Posted in
                    {categories.map(category => (
                        <li key={category}>{category}</li>
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
        </article>
    );
};

export const PostPage = withRouter(postPageClass);
