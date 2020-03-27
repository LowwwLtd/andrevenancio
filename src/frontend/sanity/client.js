import sanityClient from '@sanity/client';

export const client = sanityClient({
    projectId: 'x3asfymk', // you can find this in sanity.json
    dataset: 'production', // or the name you chose in step 1
    useCdn: true, // `false` if you want to ensure fresh data
});
