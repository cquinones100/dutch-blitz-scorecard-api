import React, { useEffect, useState } from 'react'
import useRoundTransition from './hooks/useRoundTransition';
import PlayerScore from './types/PlayerScore';
import { Col } from 'react-bootstrap';
import Row from './layout/Row';
import CenteredH from './layout/CenteredH';

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
    <Row>
      <Col>
        {winner && <CenteredH h={1}>{winner.player_name} won the last round!</CenteredH>}
        <CenteredH h={1}>Round starting in {countDown}</CenteredH>
      </Col>
    </Row>
  );
};

export default RoundTransition;
