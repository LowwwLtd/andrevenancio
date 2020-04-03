/* eslint-disable max-len */
import React from 'react';
import { WebGL, WebGLElement } from 'app/components/common/three-renderer';
import './style.scss';

export const TestPage = () => {
    const data = {
        images: [
            {
                title: 'How it works',
                url:
                    'https://dom-to-webgl.s3.amazonaws.com/nadine-shaabana-3YYiDD_4Xg4.jpg',
                copy:
                    "Under the hood we are taking normal react components and rendering those first. Then we have another component that wraps specific elements and recreates them in webgl using their position & color / texture for the mesh. The original DOM element is at opacity 0 so it's technically always there and we can use it when needed as a fallback.",
            },
            {
                title: 'Fallbacks',
                url:
                    'https://dom-to-webgl.s3.amazonaws.com/bruno-cervera-JP8HPBcmWO0.jpg',
                copy:
                    "Some devices might not support specific features you're using, or maybe performance isn't great - or maybe the design calls for more static elements on mobile. Either way you always have a fallback and can easily switch off the webgl layer and re-enable the original DOM element.",
            },
            {
                title: 'Other possibilities',
                url:
                    'https://dom-to-webgl.s3.amazonaws.com/alex-simpson-e8kYjCQctr4.jpg',
                copy:
                    'This is kept simple for this example but the principals are the same and can be applied to many things including other DOM elements like divs, text, videos.',
            },
            {
                title: 'Learn more',
                url:
                    'https://dom-to-webgl.s3.amazonaws.com/alexander-pozdeev-uGVQ3Qing0s.jpg',
                copy:
                    'Finishing up an article that will go into more details about this feature as well as the rest of the tech details for the new Firstborn.com - stay tuned!',
            },
        ],
        examples: [
            {
                url:
                    'https://dom-to-webgl.s3.amazonaws.com/luke-witter-4D7-9lVUvNY.jpg',
            },
            {
                url:
                    'https://dom-to-webgl.s3.amazonaws.com/william-navarro-QpgISxTjsqY.jpg',
            },
            {
                url:
                    'https://dom-to-webgl.s3.amazonaws.com/markus-spiske-j2yvpBdmGyg.jpg',
            },
        ],
    };
    return (
        <div className="test">
            <WebGL>
                {data.images.map((contentBlock, i) => {
                    return (
                        <WebGLElement
                            key={`im${i}`}
                            type="image"
                            data={contentBlock}
                        />
                    );
                })}
                <div className="grid">
                    {data.examples.map((image, i) => {
                        return (
                            <WebGLElement
                                key={`example${i}`}
                                type="example-image"
                                data={image}
                            />
                        );
                    })}
                </div>
            </WebGL>
        </div>
    );
};
