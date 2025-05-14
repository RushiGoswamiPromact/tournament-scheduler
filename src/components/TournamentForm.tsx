import React, { useState, useEffect } from 'react';
import { UserCircle2, Rotate3D as Rotate, X, Save, Printer, List, Calendar } from 'lucide-react';
import PlayerList from './PlayerList';
import MatchSchedule from './MatchSchedule';
import MatchOrder from './MatchOrder';
import { generateRoundRobinMatches, assignMatchDates } from '../utils/tournament';
import { Tournament, Player, Match } from '../types';

const TournamentForm: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament>(() => {
    const saved = localStorage.getItem('tournament');
    const defaultInitialState: Tournament = {
      playerCount: 4,
      playTwice: false,
      players: [],
      matches: [],
      matchesPerDay: 2,
      startDate: new Date().toISOString().split('T')[0],
      weekType: 'normal',
      selectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      isFullWeek: true
    };
    if (saved) {
      try {
        const parsedSaved = JSON.parse(saved);
        // Merge parsed state with defaults to ensure all keys are present
        return { ...defaultInitialState, ...parsedSaved };
      } catch (error) {
        console.error("Failed to parse tournament data from localStorage", error);
        // Fallback to default state if parsing fails or data is corrupt
        return defaultInitialState;
      }
    }
    return defaultInitialState;
  });
  
  const [step, setStep] = useState<'setup' | 'players' | 'schedule' | 'order'>(() => {
    return tournament.matches.length > 0 ? 'schedule' : 
           tournament.players.length > 0 ? 'players' : 'setup';
  });

  useEffect(() => {
    localStorage.setItem('tournament', JSON.stringify(tournament));
  }, [tournament]);

  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    if (count >= 2 && count <= 20) {
      setTournament(prev => ({
        ...prev,
        playerCount: count,
      }));
    }
  };

  const handlePlayTwiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTournament(prev => ({
      ...prev,
      playTwice: e.target.checked
    }));
  };

  const handleMatchesPerDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    if (count >= 1 && count <= 10) {
      setTournament(prev => ({
        ...prev,
        matchesPerDay: count
      }));
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTournament(prev => ({
      ...prev,
      startDate: e.target.value
    }));
  };

  const handleWeekTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWeekType = e.target.value as 'normal' | 'workweek' | 'weekend';
    let newSelectedDays: string[] = [...tournament.selectedDays];
    let newIsFullWeek = tournament.isFullWeek;

    if (newWeekType === 'workweek') {
      newSelectedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      newIsFullWeek = true;
    } else if (newWeekType === 'weekend') {
      newSelectedDays = ['Saturday', 'Sunday'];
      newIsFullWeek = true;
    } else {
      if (tournament.isFullWeek) {
        newSelectedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      }
    }
    setTournament(prev => ({
      ...prev,
      weekType: newWeekType,
      selectedDays: newSelectedDays,
      isFullWeek: newIsFullWeek,
    }));
  };

  const handleIsFullWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    let newSelectedDays = [...tournament.selectedDays];
    if (checked) {
      if (tournament.weekType === 'normal') {
        newSelectedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      } else if (tournament.weekType === 'workweek') {
        newSelectedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      }
    }
    setTournament(prev => ({
      ...prev,
      isFullWeek: checked,
      selectedDays: newSelectedDays
    }));
  };
  
  const allWeekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSelectedDaysChange = (day: string) => {
    const newSelectedDays = tournament.selectedDays.includes(day)
      ? tournament.selectedDays.filter(d => d !== day)
      : [...tournament.selectedDays, day];
    
    let newIsFullWeek = tournament.isFullWeek;
    if (tournament.weekType === 'normal' && newSelectedDays.length < 7) {
        newIsFullWeek = false;
    } else if (tournament.weekType === 'workweek' && (newSelectedDays.length < 5 || !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].every(d => newSelectedDays.includes(d))) ) {
        newIsFullWeek = false;
    }

    setTournament(prev => ({
      ...prev,
      selectedDays: newSelectedDays,
      isFullWeek: newIsFullWeek,
    }));
  };

  const handlePlayerNamesSubmit = (players: Player[]) => {
    const matches = generateRoundRobinMatches(players, tournament.playTwice);
    const matchesWithDates = assignMatchDates(
        matches, 
        tournament.startDate!, 
        tournament.matchesPerDay,
        tournament.weekType,
        tournament.selectedDays,
    );
    
    setTournament(prev => ({
      ...prev,
      players,
      matches: matchesWithDates
    }));
    setStep('schedule');
  };

  const handleMatchesReorder = (newMatches: Match[]) => {
    const updatedMatches = assignMatchDates(
        newMatches, 
        tournament.startDate!, 
        tournament.matchesPerDay,
        tournament.weekType,
        tournament.selectedDays,
    );
    setTournament(prev => ({
      ...prev,
      matches: updatedMatches
    }));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset? All data will be lost.')) {
      setTournament({
        playerCount: 4,
        playTwice: false,
        players: [],
        matches: [],
        matchesPerDay: 2,
        startDate: new Date().toISOString().split('T')[0],
        weekType: 'normal',
        selectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        isFullWeek: true
      });
      setStep('setup');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStartOver = () => {
    setStep('setup');
    setTournament(prev => ({
      ...prev,
      players: [],
      matches: []
    }));
  };

  const continueToPlayers = () => {
    const initialPlayers = Array.from({ length: tournament.playerCount }, (_, i) => ({
      id: i + 1,
      name: ''
    }));
    
    setTournament(prev => ({
      ...prev,
      players: initialPlayers
    }));
    
    setStep('players');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {step === 'setup' && (
        <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
          <h2 className="text-xl font-bold mb-6 flex items-center text-blue-800">
            <UserCircle2 className="mr-2" />
            Tournament Setup
          </h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="playerCount" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Players (2-20)
              </label>
              <input
                type="number"
                id="playerCount"
                min="2"
                max="20"
                value={tournament.playerCount}
                onChange={handlePlayerCountChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="matchesPerDay" className="block text-sm font-medium text-gray-700 mb-1">
                Matches Per Day (1-10)
              </label>
              <input
                type="number"
                id="matchesPerDay"
                min="1"
                max="10"
                value={tournament.matchesPerDay}
                onChange={handleMatchesPerDayChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Tournament Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={tournament.startDate}
                onChange={handleStartDateChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="playTwice"
                checked={tournament.playTwice}
                onChange={handlePlayTwiceChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="playTwice" className="ml-2 block text-sm text-gray-700">
                Double round-robin (each player plays against all others twice)
              </label>
            </div>
            
            <div>
              <label htmlFor="weekType" className="block text-sm font-medium text-gray-700 mb-1">
                Week Type for Scheduling
              </label>
              <select
                id="weekType"
                value={tournament.weekType}
                onChange={handleWeekTypeChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="normal">Normal Week (Customize days)</option>
                <option value="workweek">Work Week (Mon-Fri)</option>
                <option value="weekend">Weekend (Sat-Sun)</option>
              </select>
            </div>

            {(tournament.weekType === 'normal' || tournament.weekType === 'workweek') && (
              <div className="space-y-3 mt-4 p-4 border border-gray-200 rounded-md">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFullWeek"
                    checked={tournament.isFullWeek}
                    onChange={handleIsFullWeekChange}
                    disabled={tournament.weekType === 'weekend'}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isFullWeek" className="ml-2 block text-sm text-gray-700">
                    {tournament.weekType === 'normal' ? 'Full Week (All 7 days)' : 'Full Work Week (Mon-Fri)'}
                  </label>
                </div>
                
                {!tournament.isFullWeek && (tournament.weekType === 'normal' || tournament.weekType === 'workweek') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Days:</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {allWeekDays.map(day => {
                        if (tournament.weekType === 'workweek' && !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day)) {
                          return null;
                        }
                        return (
                          <div key={day} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`day-${day}`}
                              checked={tournament.selectedDays.includes(day)}
                              onChange={() => handleSelectedDaysChange(day)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`day-${day}`} className="ml-2 text-sm text-gray-700">{day}</label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={continueToPlayers}
                className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-md transition duration-200 flex items-center"
              >
                Continue <Rotate className="ml-2" size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {step === 'players' && (
        <PlayerList 
          players={tournament.players} 
          onSubmit={handlePlayerNamesSubmit} 
          onCancel={handleStartOver}
        />
      )}
      
      {(step === 'schedule' || step === 'order') && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-800">Tournament Schedule</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(step === 'schedule' ? 'order' : 'schedule')}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition duration-200 flex items-center text-sm"
                >
                  {step === 'schedule' ? <List className="mr-1" size={16} /> : <Calendar className="mr-1" size={16} />}
                  {step === 'schedule' ? 'Match Order' : 'Round View'}
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-200 flex items-center text-sm"
                >
                  <Printer className="mr-1" size={16} />
                  Print
                </button>
                <button
                  onClick={handleReset}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-200 flex items-center text-sm"
                >
                  <X className="mr-1" size={16} />
                  Reset
                </button>
                <button
                  onClick={handleStartOver}
                  className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md transition duration-200 flex items-center text-sm"
                >
                  <Save className="mr-1" size={16} />
                  New
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-1">
                <strong>Format:</strong> {tournament.playTwice ? 'Double' : 'Single'} Round-Robin
              </p>
              <p className="text-gray-600">
                <strong>Players:</strong> {tournament.players.length}
              </p>
              <p className="text-gray-600">
                <strong>Matches Per Day:</strong> {tournament.matchesPerDay}
              </p>
            </div>
            
            {step === 'schedule' ? (
              <MatchSchedule matches={tournament.matches} players={tournament.players} />
            ) : (
              <MatchOrder 
                matches={tournament.matches} 
                players={tournament.players}
                onMatchesReorder={handleMatchesReorder}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentForm;