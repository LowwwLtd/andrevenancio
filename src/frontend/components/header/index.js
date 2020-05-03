import React, { PureComponent } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './style.scss';

export class Header extends PureComponent {
    render() {
        return (
            <header className="header">
                <Link to="/" className="logo noselect">
                    André Venâncio
                </Link>
                <nav>
                    <NavLink to="/work" className="noselect">
                        WORK
                    </NavLink>
                    <NavLink to="/about" className="noselect">
                        ABOUT
                    </NavLink>
                </nav>
            </header>
        );
    }
}
