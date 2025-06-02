import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PollDetail({ poll, onBack }) {
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  const toggleSelection = (index) => {
    if (poll.multi) {
      setSelectedIndexes(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
    } else {
      setSelectedIndexes([index]);
    }
  };

  const vote = () => {
    fetch('/.netlify/functions/votePoll', {
      method: 'POST',
      body: JSON.stringify({ pollId: poll.id, optionIndexes: selectedIndexes, ip: window.location.hostname })
    }).then(() => onBack());
  };

  return (
    <div>
      <button onClick={onBack} className="mb-2">← Back</button>
      <h2 className="text-xl font-semibold mb-2">{poll.question}</h2>
      <p className="text-sm text-gray-500 mb-2">County: {poll.county}</p>
      {poll.expiresAt && <p className="text-sm text-red-600 mb-2">Expires at: {new Date(poll.expiresAt).toLocaleString()}</p>}

      {poll.options.map((opt, i) => (
        <div key={i}>
          <label>
            <input
              type={poll.multi ? 'checkbox' : 'radio'}
              name="vote"
              value={i}
              checked={selectedIndexes.includes(i)}
              onChange={() => toggleSelection(i)}
            /> {opt.text} ({opt.votes})
          </label>
        </div>
      ))}

      <button onClick={vote} disabled={selectedIndexes.length === 0} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">Vote</button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Live Results</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={poll.options.map(opt => ({ name: opt.text, votes: opt.votes }))}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="votes" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
