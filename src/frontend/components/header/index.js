import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import './style.scss';

export class Header extends PureComponent {
    render() {
        return (
            <header className="header">
                <section>
                    <div className="logo noselect">André Venâncio</div>
                    <nav>
                        <NavLink to="/work" exact className="noselect">
                            WORK
                        </NavLink>
                        <NavLink to="/about" exact className="noselect">
                            ABOUT
                        </NavLink>
                    </nav>
                </section>
            </header>
        );
    }
}
