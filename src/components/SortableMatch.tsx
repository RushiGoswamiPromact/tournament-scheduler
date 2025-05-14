import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableMatchProps {
  id: string;
  index: number;
  player1: string;
  player2: string;
  round: number;
}

export const SortableMatch: React.FC<SortableMatchProps> = ({
  id,
  index,
  player1,
  player2,
  round,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center p-4 bg-gray-50 rounded-lg border ${
        isDragging ? 'border-blue-500 shadow-lg' : 'border-gray-200'
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:text-blue-600 mr-4"
      >
        <GripVertical size={20} />
      </div>
      
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-gray-500">#{index}</span>
          <div className="flex items-center">
            <span className="font-medium text-blue-800">{player1}</span>
            <span className="mx-2 text-orange-500 font-bold">vs</span>
            <span className="font-medium text-blue-800">{player2}</span>
          </div>
        </div>
        <span className="text-sm text-gray-500">Round {round}</span>
      </div>
    </div>
  );
};