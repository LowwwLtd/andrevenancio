import groq from 'groq';

// https://www.sanity.io/docs/query-cheat-sheet
// https://github.com/sanity-io/tutorial-sanity-blog-react-next/blob/master/web/pages/post/%5Bslug%5D.js

export const GET_ALL_POSTS = groq`
*[_type == "post"]
`;

export const GET_POST = groq`*[_type == "post" && slug.current == $postId][0]{
    title,
    "name": author->name,
    "categories": categories[]->title,
    "authorImage": author->image,
    info,
    "technology": technology[]->title,
    body
  }`;
