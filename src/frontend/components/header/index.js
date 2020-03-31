import React, { PureComponent } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './style.scss';

export class Header extends PureComponent {
    render() {
        return (
            <header className="header">
                <Link to="/" className="logo">
                    André Venâncio
                </Link>
                <nav>
                    <NavLink to="/work">WORK</NavLink>
                    <NavLink to="/about">ABOUT</NavLink>
                </nav>
            </header>
        );
    }
}
