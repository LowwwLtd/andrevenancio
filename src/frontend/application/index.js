/* eslint-disable react/prop-types */
import React from 'react';
import { withRouter, Route } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { routes } from 'app/routes';
import { Header } from 'app/components/header';
import './style.scss';

const Application = () => {
    return (
        <>
            <Header />
            <>
                {routes.map(route => (
                    <Route
                        key={`component-${route.path}`}
                        path={route.path}
                        exact={route.exact}
                    >
                        {({ match }) => (
                            <CSSTransition
                                in={match != null}
                                timeout={500}
                                classNames="fade"
                                unmountOnExit
                            >
                                {route.child}
                            </CSSTransition>
                        )}
                    </Route>
                ))}
            </>
        </>
    );
};

export default withRouter(Application);
