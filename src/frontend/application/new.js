/* eslint-disable react/prop-types */
import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { routes } from 'app/routes';
import { Header } from 'app/components/header';
import './style.scss';

const Application = ({ location }) => {
    return (
        <>
            <Header />
            <Switch location={location}>
                {routes.map(route => (
                    <Route
                        key={`component-${route.path}`}
                        path={route.path}
                        exact={route.exact}
                    >
                        {route.child}
                    </Route>
                ))}
            </Switch>
        </>
    );
};

export default withRouter(Application);
