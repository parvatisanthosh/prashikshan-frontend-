import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function TestChat() {
  const [status, setStatus] = useState('Not connected');
  const [socket, setSocket] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get token
    const token = localStorage.getItem('token');
    console.log('Token:', token ? 'Found' : 'Not found');
    setStatus('Token: ' + (token ? 'Found ✓' : 'Missing ✗'));

    if (!token) {
      setError('No token found. Please login first.');
      return;
    }

    // Try to connect
    setStatus('Connecting to backend...');
    const BACKEND_URL = 'http://localhost:8000';
    
    try {
      const newSocket = io(BACKEND_URL, {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('✅ Connected!');
        setStatus('Connected to WebSocket ✓');
        setError('');
      });

      newSocket.on('connect_error', (err) => {
        console.error('Connection error:', err);
        setStatus('Connection failed ✗');
        setError(`Connection error: ${err.message}`);
      });

      newSocket.on('error', (err) => {
        console.error('Socket error:', err);
        setError(`Socket error: ${err.message}`);
      });

      setSocket(newSocket);

      return () => newSocket.close();
    } catch (err) {
      console.error('Setup error:', err);
      setError(`Setup error: ${err.message}`);
    }
  }, []);

  // Test API call
  const testAPI = async () => {
    setStatus('Testing API...');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/chat/rooms', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Data:', data);
      setRooms(data.chatRooms || []);
      setStatus(`API working ✓ - Found ${data.chatRooms?.length || 0} rooms`);
      setError('');
    } catch (err) {
      console.error('API Error:', err);
      setError(`API Error: ${err.message}`);
      setStatus('API failed ✗');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Chat Connection Test</h1>
        
        {/* Status */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-bold mb-2">Status:</h2>
          <p className="text-lg">{status}</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="font-bold text-red-700 mb-2">Error:</h2>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Test Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={testAPI}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Test API Connection
          </button>

          <button
            onClick={() => {
              const token = localStorage.getItem('token');
              alert(token ? `Token exists: ${token.substring(0, 20)}...` : 'No token found');
            }}
            className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
          >
            Check Token
          </button>

          <button
            onClick={() => {
              console.log('Socket object:', socket);
              console.log('Socket connected:', socket?.connected);
              alert(`Socket: ${socket ? 'Exists' : 'Null'}\nConnected: ${socket?.connected || 'No'}`);
            }}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
          >
            Check Socket Status
          </button>
        </div>

        {/* Rooms Display */}
        {rooms.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h2 className="font-bold mb-2 text-green-700">Chat Rooms Found:</h2>
            <ul className="space-y-2">
              {rooms.map(room => (
                <li key={room.id} className="p-2 bg-white rounded border">
                  <div className="font-semibold">{room.name}</div>
                  <div className="text-sm text-gray-600">{room.type}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs">
          <h2 className="font-bold mb-2">Debug Info:</h2>
          <ul className="space-y-1 text-gray-600">
            <li>• Backend URL: http://localhost:8000</li>
            <li>• API Endpoint: http://localhost:8000/chat/rooms</li>
            <li>• WebSocket: ws://localhost:8000</li>
            <li>• Check browser console (F12) for detailed logs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}