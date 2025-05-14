import { Player, Match } from '../types';

export const generateRoundRobinMatches = (players: Player[], playTwice: boolean): Match[] => {
  const matches: Match[] = [];
  const playerCount = players.length;
  
  const participants = playerCount % 2 === 0 ? [...players] : [...players, { id: -1, name: 'BYE' }];
  const n = participants.length;
  
  const rounds = n - 1;
  
  for (let round = 1; round <= rounds; round++) {
    for (let match = 0; match < n / 2; match++) {
      let home = match;
      let away = n - 1 - match;
      
      if (match === 0) {
        away = round;
      } else {
        home = (round + match) % (n - 1);
        if (home === 0) home = n - 1;
        
        away = (round - match + n - 1) % (n - 1);
        if (away === 0) away = n - 1;
      }
      
      if (participants[home].id !== -1 && participants[away].id !== -1) {
        matches.push({
          round,
          player1: participants[home].id,
          player2: participants[away].id
        });
      }
    }
  }
  
  if (playTwice) {
    const singleRoundMatches = [...matches];
    let currentRound = rounds;
    
    singleRoundMatches.forEach(match => {
      if (match.round > currentRound) {
        currentRound = match.round;
      }
    });
    
    singleRoundMatches.forEach(match => {
      matches.push({
        round: match.round + rounds,
        player1: match.player2,
        player2: match.player1
      });
    });
  }
  
  return matches;
};

export const assignMatchDates = (matches: Match[], startDate: string, matchesPerDay: number): Match[] => {
  const sortedMatches = [...matches];
  let currentDate = new Date(startDate);
  let matchesOnCurrentDate = 0;

  return sortedMatches.map(match => {
    if (matchesOnCurrentDate >= matchesPerDay) {
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      matchesOnCurrentDate = 0;
    }

    matchesOnCurrentDate++;
    return {
      ...match,
      date: currentDate.toISOString().split('T')[0]
    };
  });
};