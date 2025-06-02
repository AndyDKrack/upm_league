import React, { useEffect, useState } from 'react';

export default function PollList({ onSelect, onCreate }) {
  const [activePolls, setActivePolls] = useState([]);
  const [expiredPolls, setExpiredPolls] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/.netlify/functions/getPolls')
      .then(res => res.json())
      .then(data => {
        setActivePolls(data.active);
        setExpiredPolls(data.expired);
      });
  }, []);

  const filteredExpired = expiredPolls.filter(p => p.question.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <button onClick={onCreate} className="mb-4 bg-green-500 text-white px-3 py-1 rounded">Create Poll</button>

      <h2 className="text-lg font-semibold mb-2">Active Polls</h2>
      {activePolls.map(p => (
        <div key={p.id} className="border p-2 mb-2">
          <h3 className="font-semibold">{p.question}</h3>
          <button className="text-blue-500 underline" onClick={() => onSelect(p)}>View & Vote</button>
        </div>
      ))}

      <h2 className="text-lg font-semibold mt-6 mb-2">Search Past Polls</h2>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search expired polls"
        className="w-full border p-1 mb-4"
      />
      {filteredExpired.map(p => (
        <div key={p.id} className="border p-2 mb-2 bg-gray-50">
          <h3 className="font-semibold">{p.question}</h3>
          <button className="text-blue-500 underline" onClick={() => onSelect(p)}>View Results</button>
        </div>
      ))}
    </div>
  );
}
