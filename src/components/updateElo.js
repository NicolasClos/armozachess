export default function updateElo(player, opponent, result, tournamentEloAverage, byeValue) {
    const calculateExpectedScore = (opponentElo) => {
      return 1 / (1 + 10 ** ((opponentElo - player.elo) / 400));
    };
  
    const kFactor = player.games < 30 ? 40 : 20;
  
    if (result === 'BYE') {
      const expectedScore = calculateExpectedScore(tournamentEloAverage);
      const actualScore = byeValue; 
      const eloChange = Math.round(kFactor * (actualScore - expectedScore));
  
      return eloChange;
    }
  
    // Calcular la variación de Elo normal para una partida real
    const expectedScore = calculateExpectedScore(opponent.elo);
    const actualScore = result === 'win' ? 1 : result === 'draw' ? 0.5 : result === 'lose' ? 0 : '';
    const eloChange = Math.round(kFactor * (actualScore - expectedScore));
  
    return eloChange;
  }