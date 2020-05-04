import React from 'react';
import PropTypes from 'prop-types';
import { VFXDom } from 'app/components/vfx/elements';
import './style.scss';

export const Footer = ({ client }) => {
    return (
        <VFXDom>
            <footer className="footer">
                <section>
                    ©2020 André Venâncio. All image rights belong to &quot;
                    {client}
                    &quot;.
                </section>
            </footer>
        </VFXDom>
    );
};

Footer.propTypes = {
    client: PropTypes.string,
};
