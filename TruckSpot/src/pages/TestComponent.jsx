// TestComponent.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TestComponent() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const testConnection = async () => {
            try {
                // First test the basic endpoint
                const testResponse = await axios.get('http://localhost:5000/test');
                console.log('Test endpoint response:', testResponse.data);

                // Then test the events endpoint
                const eventsResponse = await axios.get('http://localhost:5000/api/events');
                console.log('Events endpoint response:', eventsResponse.data);
                setData(eventsResponse.data);
            } catch (err) {
                console.error('Connection error:', {
                    message: err.message,
                    code: err.code,
                    response: err.response
                });
                setError(err.message);
            }
        };

        testConnection();
    }, []);

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Test Component</h2>
            {data ? (
                <pre className="bg-gray-100 p-4 rounded">
                    {JSON.stringify(data, null, 2)}
                </pre>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default TestComponent;