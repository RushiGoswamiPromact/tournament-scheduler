import React from 'react';
import { Match, Player } from '../types';

interface MatchScheduleProps {
  matches: Match[];
  players: Player[];
}

const MatchSchedule: React.FC<MatchScheduleProps> = ({ matches, players }) => {
  // Group matches by round
  const matchesByRound: { [key: number]: Match[] } = matches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {} as { [key: number]: Match[] });

  // Get player name by ID
  const getPlayerName = (id: number): string => {
    const player = players.find(p => p.id === id);
    return player ? player.name : `Player ${id}`;
  };

  return (
    <div className="space-y-8 print:space-y-4">
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold">Tournament Schedule</h1>
        <p className="text-gray-600">
          {players.length} Players - {Object.keys(matchesByRound).length} Rounds
        </p>
      </div>
      
      {Object.keys(matchesByRound).map((roundKey) => {
        const roundNumber = parseInt(roundKey);
        const roundMatches = matchesByRound[roundNumber];
        
        return (
          <div key={roundNumber} className="rounded-lg bg-white print:bg-white overflow-hidden border border-gray-200 shadow-sm print:shadow-none">
            <div className="bg-blue-800 text-white px-4 py-2 print:bg-gray-200 print:text-black">
              <h3 className="font-bold">Round {roundNumber}</h3>
            </div>
            
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 print:gap-2">
              {roundMatches.map((match, index) => (
                <div 
                  key={`${match.round}-${index}`} 
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
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Match {index + 1}
                  </div>
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