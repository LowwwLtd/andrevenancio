/* eslint-disable react/prop-types */
import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Transition, fade } from 'snap-transition';
import { routes } from 'app/routes';
import { Header } from 'app/components/header';
// import { VFX } from 'app/components/vfx';

const Application = ({ location }) => {
    return (
        <>
            <Header />
            <Transition location={location} type={fade()}>
                <Switch location={location}>
                    {routes.map((route) => (
                        <Route
                            key={`component-${route.path}`}
                            path={route.path}
                            exact={route.exact}
                        >
                            {route.child}
                        </Route>
                    ))}
                </Switch>
            </Transition>
        </>
    );
};

export default withRouter(Application);
