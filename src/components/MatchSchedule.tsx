import React from 'react';
import { Match, Player } from '../types';

interface MatchScheduleProps {
  matches: Match[];
  players: Player[];
}

// Helper to format date string for display
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Date TBD';
  const date = new Date(dateString);
  // Adjust for timezone to prevent off-by-one day errors due to UTC conversion
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() + userTimezoneOffset);
  return localDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const MatchSchedule: React.FC<MatchScheduleProps> = ({ matches, players }) => {
  // Sort matches by date first, then by round as a secondary sort if dates are the same
  const sortedMatches = [...matches].sort((a, b) => {
    if (a.date && b.date) {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
    }
    // If dates are the same or one is undefined, sort by round
    return a.round - b.round;
  });

  // Group matches by date
  const matchesByDate: { [key: string]: Match[] } = sortedMatches.reduce((acc, match) => {
    const dateKey = match.date || 'Date TBD'; // Group matches without a date under 'Date TBD'
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(match);
    return acc;
  }, {} as { [key: string]: Match[] });

  // Get player name by ID
  const getPlayerName = (id: number): string => {
    const player = players.find(p => p.id === id);
    return player ? player.name : `Player ${id}`;
  };

  const dateKeys = Object.keys(matchesByDate);
  // If 'Date TBD' exists, move it to the end or handle as per preference
  // For now, default sort order of keys (which might be insertion order or string sort)

  return (
    <div className="space-y-8 print:space-y-4">
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold">Tournament Match Schedule</h1>
        <p className="text-gray-600">
          {players.length} Players
        </p>
      </div>
      
      {dateKeys.map((dateKey) => {
        const dateMatches = matchesByDate[dateKey];
        
        return (
          <div key={dateKey} className="rounded-lg bg-white print:bg-white overflow-hidden border border-gray-200 shadow-sm print:shadow-none">
            <div className="bg-blue-800 text-white px-4 py-2 print:bg-gray-200 print:text-black">
              <h3 className="font-bold">Matches for {formatDate(dateKey === 'Date TBD' ? undefined : dateKey)}</h3>
            </div>
            
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 print:gap-2">
              {dateMatches.map((match, index) => (
                <div 
                  key={`${match.date}-${match.player1}-${match.player2}-${index}`} // More unique key
                  className="border border-gray-200 rounded-md p-3 bg-gray-50 hover:bg-blue-50 transition-colors duration-200 print:bg-white print:border-gray-300"
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-blue-800 print:text-black">
                      {getPlayerName(match.player1)}
                    </div>
                    <div className="text-orange-500 font-bold print:text-black">vs</div>
                    <div className="font-medium text-blue-800 text-right print:text-black">
                      {getPlayerName(match.player2)}
                    </div>
                  </div>
                  {/* Optionally display round or match index if needed */}
                  {/* <div className="mt-2 text-xs text-gray-500 text-center">
                    Match {index + 1} (Round {match.round})
                  </div> */}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      
      {matches.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No matches generated yet. Please enter player information and generate the schedule.
        </div>
      )}
    </div>
  );
};

export default MatchSchedule;