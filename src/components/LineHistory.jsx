import React from 'react';

const LineHistory = ({ lines, history }) => (
  <div className="mt-6">
    <h4 className="text-xl mb-2">✍️ Line Edit History</h4>
    <ul className="space-y-1 bg-slate-800 p-4 rounded-lg shadow-inner">
      {lines.map((line, idx) => {
        const editors = history[idx] || [];
        const current = editors[0];
        const prev = editors[1];

        return (
          <li key={idx} className="text-sm">
            <strong className="text-blue-300">Line {idx + 1}:</strong>{' '}
            {line || <em className="text-gray-400">(empty)</em>}
            {current && (
              <span className="text-green-400">
                {' — edited by '}
                {prev ? prev.username : current.username}
                {prev && ` (now: ${current.username})`}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  </div>
);

export default LineHistory;
