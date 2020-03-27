/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import './style.scss';

export const SoonPage = () => {
    return (
        <div className="soon">
            <h1>Hi 👋!</h1>
            <div>
                <p>I&apos;m taking some time to rebuild my portfolio.</p>
                <p>
                    Why dont you say hi on{' '}
                    <a
                        href="https://twitter.com/andrevenancio"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Twitter
                    </a>
                    ?
                </p>
            </div>
        </div>
    );
};
