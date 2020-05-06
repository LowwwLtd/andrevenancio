/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { getMobile, setMobile } from 'app/constants';
import { Transition, verticalSlide } from 'app/components/transition'; // 'snap-transition';
import { routes } from 'app/routes';
import { Header } from 'app/components/header';
import { VFX } from 'app/components/vfx';
import { getParam } from 'app/utils/params';
import './style.scss';

const Application = ({ location }) => {
    const [type, setType] = useState(getMobile() === false ? 'webgl' : null);

    const chooseType = (value) => {
        setType(value);
        setMobile(value === 'html');
    };

    if (!type) {
        return (
            <div className="mobile-select-menu">
                <h2>Mobile Detected</h2>
                <p>Please choose a version</p>
                <div className="versions">
                    <div className="button" onClick={() => chooseType('html')}>
                        HTML
                    </div>
                    <div className="button" onClick={() => chooseType('webgl')}>
                        WEBGL
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <VFX debug={getParam('debug') === 'true'}>
                <Transition location={location} type={verticalSlide()}>
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
            </VFX>
        </>
    );
};

export default withRouter(Application);
