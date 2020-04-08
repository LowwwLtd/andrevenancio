/* eslint-disable max-len */
import React from 'react';
import { WebGL, WebGLElement } from 'app/components/common/three-renderer';
import './style.scss';

export const TestPage = () => {
    const data = [
        {
            url:
                'https://cdn.sanity.io/images/zhaneedf/production/f4bc8a8659a40f2e40b6c72c2f536049022a73f4-1920x1080.jpg',
        },
        {
            url:
                'https://cdn.sanity.io/images/zhaneedf/production/255526d55f726502d0dd01ed17872beca47e288b-1920x1080.jpg?rect=0,0,1920,1078',
        },
    ];
    return (
        <div className="test">
            <WebGL>
                <h1>This is a test</h1>
                <p>Make sure you scroll</p>
                {data.map((contentBlock, i) => {
                    return (
                        <WebGLElement
                            key={`im${i}`}
                            type="image"
                            data={contentBlock}
                        />
                    );
                })}
            </WebGL>
        </div>
    );
};
