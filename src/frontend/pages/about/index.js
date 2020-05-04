/* eslint-disable max-len */
import React, { PureComponent } from 'react';
import { ImageComponent } from 'app/components/image';
import { VFXDom } from 'app/components/vfx/elements';
import './style.scss';

export class AboutPage extends PureComponent {
    render() {
        return (
            <div className="about">
                <div className="about__content">
                    <div className="img">
                        <ImageComponent
                            src="/img/about.jpg"
                            alt="André Venâncio"
                        />
                    </div>
                    <section>
                        <VFXDom>
                            <h2>Bio</h2>
                        </VFXDom>
                        <VFXDom>
                            <p>
                                Hello{' '}
                                <span
                                    role="img"
                                    aria-label="wave"
                                    className="wave"
                                >
                                    👋🏻
                                </span>{' '}
                                my name is André Venâncio, and I’m a Creative
                                Developer and judge at the{' '}
                                <a
                                    href="https://thefwa.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    FWA
                                </a>
                                . I&apos;m currently{' '}
                                <span className="strike">living</span>{' '}
                                <span className="underline">
                                    self isolating
                                </span>{' '}
                                in London.
                            </p>
                        </VFXDom>
                        <VFXDom>
                            <p>
                                I craft award winning digital experiences
                                through technology focusing on high quality 2D &
                                3D applications for web, mobile & installations.
                            </p>
                        </VFXDom>
                        <VFXDom>
                            <p>
                                I’m constantly enhancing my knowledge and I aim
                                to learn more day after day and stay on the
                                forefront of the new web technologies. I’m
                                focused on creating exceptional user experiences
                                through creative design technologies. I always
                                aim to the highest levels of creativity and
                                execution in order to grow and develop online
                                experiences that leave a lasting impression.
                            </p>
                        </VFXDom>
                        <VFXDom>
                            <h2>Tools & Technologies</h2>
                        </VFXDom>
                        <VFXDom>
                            <h3>Languages:</h3>
                        </VFXDom>
                        <VFXDom>
                            <ul>
                                <li>HTML5</li>
                                <li>Javascript</li>
                                <li>CSS3</li>
                                <li>SASS</li>
                                <li>WebGL</li>
                                <li>GLSL</li>
                                <li>TypeScript</li>
                            </ul>
                        </VFXDom>
                        <VFXDom>
                            <h3>Frameworks:</h3>
                        </VFXDom>
                        <VFXDom>
                            <ul>
                                <li>React.js</li>
                                <li>Three.js</li>
                                <li>Pixi.js</li>
                                <li>Processing</li>
                                <li>Node.js</li>
                            </ul>
                        </VFXDom>
                        <VFXDom>
                            <h2>Contacts</h2>
                        </VFXDom>
                        <VFXDom>
                            <nav>
                                {' '}
                                <a
                                    href="https://www.linkedin.com/in/andrevenancio/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    LinkedIn
                                </a>
                                <a
                                    href="mailto:info@andrevenancio.com?subject=Hello%20from%20andrevenancio.com&body=Hi%20Andr%C3%A9%0D%0A"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Email
                                </a>
                                <a
                                    href="https://github.com/andrevenancio"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Github
                                </a>
                                <a
                                    href="https://twitter.com/andrevenancio"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Twitter
                                </a>
                            </nav>
                        </VFXDom>
                    </section>
                </div>
            </div>
        );
    }
}
