import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { Form, Table, Button } from 'react-bootstrap';
import Player from './types/Player';
import Round from './types/Round';
import FormField from './layout/FormField';
import ScoreDisplay from './types/ScoreDisplay';

type RoundProps = {
  number: number;
  updateScore: (value: number) => void;
  round: Round;
  player: Player;
} & ScoreDisplay;

const RoundComponent = ({ number, updateScore, round, player, Scores }: RoundProps) => {
  const [numNonBlitzCards, setNumNonBlitzCards] = useState<number | undefined>();
  const [numBlitzCards, setNumBlitzCards] = useState<number | undefined>();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSubmitted(
      round.player_scores.some(({ player_name, score }) => score && player.name === player_name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const score = numNonBlitzCards !== undefined && numBlitzCards !== undefined ?
    40 - (numNonBlitzCards! + numBlitzCards!) - (2 * numBlitzCards!) :
    0;

  const changeValue = (stringNumber: string) => {
    if (stringNumber === '') {
      return;
    } else {
      return Number(stringNumber);
    }
  };

  const onChangeNumNonBlitzCards = (e: ChangeEvent<HTMLInputElement>) => {
    setNumNonBlitzCards(changeValue(e.target.value));
  };

  const onChangeNumBlitzCards = (e: ChangeEvent<HTMLInputElement>) => {
    setNumBlitzCards(changeValue(e.target.value));
  };

  const onSubmit = () => {
    updateScore(score);
    setNumBlitzCards(0);
    setNumNonBlitzCards(0);
    setSubmitted(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNumBlitzCards(0);
      setNumNonBlitzCards(0);
      setSubmitted(false);
    }, 2000)

    return () => clearTimeout(timeout);
  }, [number]);

  return (
    <>
      <h1>Round {number}</h1>
      {!submitted && (
        <>
          <h2>Your score = {score}</h2>
          <Form>
            <FormField>
              <Form.Label htmlFor='numNonBlitzCards'>
                Number of non blitz cards
              </Form.Label>
              <Form.Control
                name='numNonBlitzCards'
                type='number'
                onChange={onChangeNumNonBlitzCards}
                value={numNonBlitzCards}
              />
            </FormField>
            <Form.Group className='mb-3'>
              <Form.Label htmlFor='numNonBlitzCards'>
                Number of blitz cards
              </Form.Label>
              <Form.Control
                name='numBlitzCards'
                type='number'
                onChange={onChangeNumBlitzCards}
                value={numBlitzCards}
              />
            </Form.Group>
            <FormField>
              <Button
                className='mb-3'
                variant='primary'
                onClick={onSubmit}
                disabled={numBlitzCards === undefined || numNonBlitzCards === undefined}
              >
                Submit
              </Button>
            </FormField>
          </Form>
        </>
      )}
      <Scores />
    </>
  );
};

export default RoundComponent;
