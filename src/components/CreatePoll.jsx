import React, { useState } from 'react';

const presetOptions = [
  ["YES", "NO"],
  ["GOOD", "BAD"],
  ["IMMEDIATELY", "TOMORROW", "FUTURE"]
];

export default function CreatePoll({ onBack }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [multi, setMulti] = useState(false);
  const [county, setCounty] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const usePreset = (preset) => setOptions(preset);

  const submit = () => {
    fetch('/.netlify/functions/createPoll', {
      method: 'POST',
      body: JSON.stringify({ question, options, multi, county, expiresAt })
    }).then(() => onBack());
  };

  return (
    <div>
      <button onClick={onBack} className="mb-2">← Back</button>
      <h2 className="text-xl font-semibold mb-2">Create New Poll</h2>
      <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Poll question" className="w-full border p-1 mb-2" />
      {options.map((opt, i) => (
        <input key={i} value={opt} onChange={e => {
          const newOpts = [...options];
          newOpts[i] = e.target.value;
          setOptions(newOpts);
        }} placeholder={`Option ${i + 1}`} className="w-full border p-1 mb-1" />
      ))}
      <button onClick={() => setOptions([...options, ''])} className="text-sm text-blue-500 mb-2">+ Add Option</button>
      <div className="mb-2">
        <span className="font-semibold text-sm">Use preset:</span>
        {presetOptions.map((preset, idx) => (
          <button key={idx} onClick={() => usePreset(preset)} className="ml-2 bg-gray-300 text-sm px-2 py-1 rounded">{preset.join('/')}</button>
        ))}
      </div>
      <label className="block mb-2">
        <input type="checkbox" checked={multi} onChange={e => setMulti(e.target.checked)} /> Allow multiple selections
      </label>
      <input value={county} onChange={e => setCounty(e.target.value)} placeholder="County" className="w-full border p-1 mb-2" />
      <input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="w-full border p-1 mb-2" />
      <button onClick={submit} className="block bg-green-600 text-white px-3 py-1 rounded">Submit Poll</button>
    </div>
  );
}
