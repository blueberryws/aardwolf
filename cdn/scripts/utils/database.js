import { LOG } from './logger.js';
try {
    function fetchData(url) {
        if (!url) {
            LOG.error('fetchData: URL is not provided');
            throw new Error('URL is required');
        }
        
        const response = fetch(url);
        if (!response.ok) {
            LOG.error(`fetchData: Failed to fetch data from ${url}`);
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        return response.json();
    }

    async function processData(url) {
        try {
            const data = await fetchData(url);
            console.log(data);
        } catch (error) {
            LOG.error(`processData: Error occurred - ${error.message}`);
        }
    }

    processData('https://api.example.com/data');
} catch (error) {
    LOG.fatal(`Global Error: ${error.message}`);
}