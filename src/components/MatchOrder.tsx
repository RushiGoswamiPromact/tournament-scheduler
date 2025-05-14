import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableMatch } from './SortableMatch';
import { Match, Player } from '../types';
import { GripVertical, Calendar } from 'lucide-react';

interface MatchOrderProps {
  matches: Match[];
  players: Player[];
  onMatchesReorder: (matches: Match[]) => void;
}

const MatchOrder: React.FC<MatchOrderProps> = ({ matches, players, onMatchesReorder }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getPlayerName = (id: number): string => {
    const player = players.find(p => p.id === id);
    return player ? player.name : `Player ${id}`;
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = matches.findIndex(m => `match-${m.round}-${m.player1}-${m.player2}` === active.id);
      const newIndex = matches.findIndex(m => `match-${m.round}-${m.player1}-${m.player2}` === over.id);
      onMatchesReorder(arrayMove(matches, oldIndex, newIndex));
    }
  };

  // Group matches by date
  const matchesByDate = matches.reduce((acc, match) => {
    const date = match.date || 'Unscheduled';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, {} as { [key: string]: Match[] });

  const formatDate = (dateStr: string) => {
    if (dateStr === 'Unscheduled') return dateStr;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <div className="mb-4 flex items-center text-gray-600">
        <GripVertical className="mr-2" />
        <span>Drag matches to reorder them</span>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={matches.map(m => `match-${m.round}-${m.player1}-${m.player2}`)}
          strategy={verticalListSortingStrategy}
        >
          {Object.entries(matchesByDate).map(([date, dateMatches]) => (
            <div key={date} className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex items-center mb-4 text-lg font-semibold text-blue-800">
                <Calendar className="mr-2" size={20} />
                {formatDate(date)}
              </div>
              <div className="space-y-2">
                {dateMatches.map((match, index) => (
                  <SortableMatch
                    key={`match-${match.round}-${match.player1}-${match.player2}`}
                    id={`match-${match.round}-${match.player1}-${match.player2}`}
                    index={index + 1}
                    player1={getPlayerName(match.player1)}
                    player2={getPlayerName(match.player2)}
                    round={match.round}
                  />
                ))}
              </div>
            </div>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default MatchOrder;