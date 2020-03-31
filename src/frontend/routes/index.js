import React from 'react';
import { SoonPage } from 'app/pages/soon';
import { WorkPage } from 'app/pages/work';
import { WorkDetailPage } from 'app/pages/work-detail';
import { AboutPage } from 'app/pages/about';

export const routes = [
    {
        path: '/',
        exact: true,
        child: <SoonPage />,
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
