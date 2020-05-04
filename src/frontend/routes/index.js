import React from 'react';
import { Redirect } from 'react-router-dom';
// import { HomePage } from 'app/pages/home';
import { WorkPage } from 'app/pages/work';
import { WorkDetailPage } from 'app/pages/work-detail';
import { AboutPage } from 'app/pages/about';

export const routes = [
    {
        path: '/',
        exact: true,
        child: <Redirect to="/work" />,
    },
    {
        path: '/work',
        exact: true,
        child: <WorkPage />,
    },
    {
        path: '/work/:postId',
        exact: true,
        child: <WorkDetailPage />,
    },
    {
        path: '/about',
        child: <AboutPage />,
    },
];
