module.exports = [
    {
        method: 'GET',
        path: '/api/test',
        handler: () => {
            return {
                type: 'json',
                message: 'test',
            };
        },
    },

    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                index: true,
            },
        },
    },
];
