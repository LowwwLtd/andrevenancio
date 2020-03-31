import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';

import history from 'app/history';
import Application from 'app/application';
import 'app/styles/index.scss';

const start = () => {
    const lib = 'color:#666;font-size:x-small;font-weight:bold;';
    const parameters = 'color:#777;font-size:x-small';
    const values = 'color:#f33;font-size:x-small';
    const version = __VERSION__;
    const node = __NODE_ENV__;
    const name = __NAME__;

    const args = [
        `%c${name}\n%cversion: %c${version}\n%cnode: %c${node}`,
        lib,
        parameters,
        values,
        parameters,
        values,
    ];

    console.log(...args);

    render(
        <Router history={history}>
            <Application />
        </Router>,
        document.getElementById('app')
    );
};

global.addEventListener('load', start);
