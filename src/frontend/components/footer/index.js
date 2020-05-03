import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

export const Footer = ({ client }) => {
    return (
        <footer className="footer">
            ©2020 André Venâncio. All image rights belong to &quot;{client}
            &quot;.
        </footer>
    );
};

Footer.propTypes = {
    client: PropTypes.string,
};
