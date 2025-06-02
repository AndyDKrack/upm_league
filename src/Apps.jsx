import React, { useEffect, useState } from 'react';
import PollList from './components/PollList';
import PollDetail from './components/PollDetail';
import CreatePoll from './components/CreatePoll';

export default function App() {
  const [view, setView] = useState('home');
  const [selectedPoll, setSelectedPoll] = useState(null);

  useEffect(() => {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('copy', e => e.preventDefault());
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'c'].includes(e.key)) e.preventDefault();
    });
    alert("By continuing, you agree that your data is handled anonymously. Right-click and copying are disabled.");
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Youth Engagement Polls</h1>
      {view === 'home' && <PollList onSelect={p => { setSelectedPoll(p); setView('detail'); }} onCreate={() => setView('create')} />}
      {view === 'detail' && <PollDetail poll={selectedPoll} onBack={() => setView('home')} />}
      {view === 'create' && <CreatePoll onBack={() => setView('home')} />}
    </div>
  );
}
