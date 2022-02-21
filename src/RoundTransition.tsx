import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { PlayerScore } from './hooks/useLobbyWeebsockets';
import useRoundTransition from './hooks/useRoundTransition';

const RoundTransition = ({
  setTransitioningRound,
  winner
}: {
    setTransitioningRound: ReturnType<typeof useRoundTransition>[1];
    winner: PlayerScore | undefined;
  }
) => {
  const [countDown, setCountDown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDown - 1);
    }, 1000);

    if (countDown === 0) {
      clearInterval(interval);
      setTransitioningRound(false);
    } 

    return () => clearInterval(interval);
  }, [countDown, setCountDown, setTransitioningRound]);

  return (
    <>
      {winner && <h1>{winner.player_name} won the last round!</h1>}
      <h1>Round starting in {countDown}</h1>
    </>
  );
};

export default RoundTransition;
