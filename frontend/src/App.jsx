import React from 'react';
import Board from './components/Board';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center font-sans text-white">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-blue-400">SyncBoard</h1>
        <p className="text-gray-400">Open this URL in a second tab to test real-time syncing!</p>
      </div>

      <Board />

      <div className="mt-8 text-sm text-gray-500">
        Powered by Spring Boot WebSockets & React Konva
      </div>
    </div>
  );
}

export default App;