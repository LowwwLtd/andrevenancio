import { useEffect, useState } from 'react';
import { client } from './client';

export const useSanityFetch = (query, queryParams = {}) => {
    const [result, setResult] = useState(null);

    const fetchData = async () => {
        const response = await client.fetch(query, queryParams);
        setResult(response);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { result };
};
