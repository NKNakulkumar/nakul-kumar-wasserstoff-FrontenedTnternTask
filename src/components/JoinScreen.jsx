import React from 'react';

function JoinScreen({ username, setUsername, onJoin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050D4A] text-white">
      <div className="bg-white bg-opacity-10 shadow-lg p-10 rounded-lg">
        <h2 className="text-2xl mb-4 text-black"><strong>👋 Welcome to the Editor</strong></h2>
        <input
          placeholder="Enter your username"
          className="p-2 rounded text-black w-full mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2  rounded w-full"
          onClick={onJoin}
        >
          Join Editor
        </button>
      </div>
    </div>
  );
}

export default JoinScreen;
