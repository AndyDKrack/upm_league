import React, { useEffect, useState } from 'react';
import DisclaimerModal from './components/DisclaimerModal';
import PollList from './components/PollList';
import PollDetail from './components/PollDetail';
import CreatePoll from './components/CreatePoll';

export default function App() {
  const [view, setView] = useState('home');
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
  if (!showDisclaimer) {
    const preventDefault = e => e.preventDefault();
    const preventKey = e => {
      if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'c'].includes(e.key)) e.preventDefault();
    };
    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('copy', preventDefault);
    document.addEventListener('keydown', preventKey);
    return () => {
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('copy', preventDefault);
      document.removeEventListener('keydown', preventKey);
    };
  }
}, [showDisclaimer]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Youth Engagement Polls</h1>
      {showDisclaimer && <DisclaimerModal onAccept={() => setShowDisclaimer(false)} />}
      {view === 'home' && <PollList onSelect={p => { setSelectedPoll(p); setView('detail'); }} onCreate={() => setView('create')} />}
      {view === 'detail' && <PollDetail poll={selectedPoll} onBack={() => setView('home')} />}
      {view === 'create' && <CreatePoll onBack={() => setView('home')} />}
    </div>
  );
}
