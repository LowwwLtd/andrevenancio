import React, { PureComponent } from 'react';
import './style.scss';

export class AboutPage extends PureComponent {
    render() {
        return (
            <div className="about">
                <div className="about__content">
                    <img src="/img/about.jpg" alt="André Venâncio" />
                    <section>
                        <h2 className="spacer-l">Bio</h2>
                        <p>
                            Hello{' '}
                            <span role="img" aria-label="wave" className="wave">
                                👋🏻
                            </span>{' '}
                            my name is André Venâncio, and I’m a Senior Creative
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
                            <span className="underline">self isolating</span> in
                            London.
                        </p>
                        <p>
                            I craft award winning digital experiences through
                            technology focusing on high quality 2D & 3D
                            applications for web, mobile & installations.
                        </p>
                        <p className="spacer-l">
                            I’m constantly enhancing my knowledge and I aim to
                            learn more day after day and stay on the forefront
                            of the new web technologies. I’m focused on creating
                            exceptional user experiences through creative design
                            technologies. I always aim to the highest levels of
                            creativity and execution in order to grow and
                            develop online experiences that leave a lasting
                            impression.
                        </p>
                        <h2 className="spacer-l">Tools & Technologies</h2>
                        <h3 className="spacer-s">Languages:</h3>
                        <ul className="spacer-l">
                            <li>HTML5</li>
                            <li>Javascript</li>
                            <li>CSS3</li>
                            <li>SASS</li>
                            <li>WebGL</li>
                            <li>GLSL</li>
                            <li>TypeScript</li>
                        </ul>
                        <h3 className="spacer-s">Frameworks:</h3>
                        <ul className="spacer-l">
                            <li>React.js</li>
                            <li>Three.js</li>
                            <li>Pixi.js</li>
                            <li>Processing</li>
                            <li>Node.js</li>
                        </ul>
                        <h2 className="spacer-l">Contacts</h2>
                        <nav>
                            <a
                                href="https://twitter.com/andrevenancio"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Twitter
                            </a>
                            <a
                                href="https://github.com/andrevenancio"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Github
                            </a>
                            <a
                                href="https://www.linkedin.com/in/andrevenancio/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                LinkedIN
                            </a>
                        </nav>
                    </section>
                </div>
            </div>
        );
    }
}
