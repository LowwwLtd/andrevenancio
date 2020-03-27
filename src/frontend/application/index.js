import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { routes } from 'app/routes';

export const Application = () => {
    return (
        <Switch>
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
    );
};
