import React, { useEffect, useState } from 'react'
import { Player } from './Room';

const RoundTransition = ({
  setTransitioningRound,
  winner
}: {
    setTransitioningRound: (value: boolean) => void,
    winner: Player | undefined,
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
      {winner && <h1>{winner.name} won the last round!</h1>}
      <h1>Round starting in {countDown}</h1>
    </>
  );
};

export default RoundTransition;
