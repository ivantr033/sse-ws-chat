const createRequest = async (options = {}) => {
    const { url, method = 'GET', data, callback } = options;

    const config = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };

    if (data && method === 'POST') {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);
        const result = await response.json();
        if (callback) callback(null, result);
        return result;
    } catch (error) {
        console.error('Network failure in createRequest:', error);
        if (callback) callback(error, null);
        throw error;
    }
};

export default createRequest;
