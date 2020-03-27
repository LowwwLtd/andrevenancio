import { useEffect, useState } from 'react';
import { client } from './client';

export const useSanityFetch = (query, queryParams = {}) => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const response = await client.fetch(query, queryParams);
        setResult(response);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { loading, result };
};
