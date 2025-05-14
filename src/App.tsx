import React from 'react';
import { Trophy } from 'lucide-react';
import TournamentForm from './components/TournamentForm';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="bg-blue-900 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center gap-2">
          <Trophy className="text-orange-400" size={32} />
          <h1 className="text-2xl font-bold">Tournament Match Maker</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <TournamentForm />
      </main>
      
      <footer className="bg-blue-900 text-white py-3 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          © {new Date().getFullYear()} Tournament Match Maker | Round Robin Generator
        </div>
      </footer>
    </div>
  );
}

export default App;