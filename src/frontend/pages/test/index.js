import React from 'react';
import './style.scss';

export const TestPage = () => {
    return (
        <div class="base-wrapper">
            <div class="parallax-container">
                <div class="wrapper">
                    <img
                        class="background__image"
                        src="https://s3-ap-southeast-2.amazonaws.com/daily-fire-assets/codepen-assets/dotted-background.png"
                    />
                    <img
                        class="middle__image"
                        src="https://s3-ap-southeast-2.amazonaws.com/daily-fire-assets/codepen-assets/stars.png"
                    />
                    <img
                        class="foreground__image"
                        src="https://s3-ap-southeast-2.amazonaws.com/daily-fire-assets/codepen-assets/polygons.png"
                    />
                </div>
            </div>
        </div>
    );
};
