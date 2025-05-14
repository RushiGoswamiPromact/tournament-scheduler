import React, { useState } from 'react';
import { ArrowRight, X, UserCircle2 } from 'lucide-react';
import { Player } from '../types';

interface PlayerListProps {
  players: Player[];
  onSubmit: (players: Player[]) => void;
  onCancel: () => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, onSubmit, onCancel }) => {
  const [playerNames, setPlayerNames] = useState<Player[]>(players);
  const [errors, setErrors] = useState<{ [key: number]: string }>({});

  const handleNameChange = (index: number, value: string) => {
    const updatedPlayers = [...playerNames];
    updatedPlayers[index] = { ...updatedPlayers[index], name: value };
    setPlayerNames(updatedPlayers);
    
    // Clear error for this field if it exists
    if (errors[index]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  const validatePlayers = (): boolean => {
    const newErrors: { [key: number]: string } = {};
    let isValid = true;
    
    // Check for empty names
    playerNames.forEach((player, index) => {
      if (!player.name.trim()) {
        newErrors[index] = "Player name cannot be empty";
        isValid = false;
      }
    });
    
    // Check for duplicate names
    const nameSet = new Set<string>();
    playerNames.forEach((player, index) => {
      const name = player.name.trim().toLowerCase();
      if (name && nameSet.has(name)) {
        newErrors[index] = "Duplicate player name";
        isValid = false;
      } else if (name) {
        nameSet.add(name);
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePlayers()) {
      onSubmit(playerNames);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
      <h2 className="text-xl font-bold mb-6 flex items-center text-blue-800">
        <UserCircle2 className="mr-2" />
        Enter Player Names
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {playerNames.map((player, index) => (
            <div key={player.id} className="relative">
              <label 
                htmlFor={`player-${index}`} 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Player {index + 1}
              </label>
              <input
                id={`player-${index}`}
                type="text"
                value={player.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className={`w-full px-4 py-2 border ${
                  errors[index] ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder={`Player ${index + 1} name`}
              />
              {errors[index] && (
                <p className="text-red-500 text-xs mt-1">{errors[index]}</p>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md transition duration-200 flex items-center"
          >
            <X className="mr-2" size={18} />
            Back
          </button>
          
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-md transition duration-200 flex items-center"
          >
            Generate Schedule
            <ArrowRight className="ml-2" size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerList;