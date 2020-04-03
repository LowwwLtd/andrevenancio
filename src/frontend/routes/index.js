import React from 'react';
import { HomePage } from 'app/pages/home';
import { WorkPage } from 'app/pages/work';
import { WorkDetailPage } from 'app/pages/work-detail';
import { AboutPage } from 'app/pages/about';
// import { TestPage } from 'app/pages/test';

export const routes = [
    {
        path: '/',
        exact: true,
        child: <HomePage />,
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
    // {
    //     path: '/test',
    //     child: <TestPage />,
    // },
];
