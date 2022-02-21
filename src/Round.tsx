import React, { useState, ChangeEvent, useEffect } from 'react';
import { Form, Table, Button } from 'react-bootstrap';
import { RoundType } from './hooks/useLobbyWeebsockets';
import { Lobby, Player } from './Room';

type RoundProps = {
  number: number;
  updateScore: (value: number) => void;
  lobby: Lobby;
  round: RoundType;
  player: Player;
};

const Round = ({ number, updateScore, lobby, round, player }: RoundProps) => {
  const [numNonBlitzCards, setNumNonBlitzCards] = useState<number | undefined>();
  const [numBlitzCards, setNumBlitzCards] = useState<number | undefined>();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSubmitted(
      round.player_scores.some(({ player_name, score }) => score && player.name === player_name));
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

  return (
    <>
      <h1>Round {number}</h1>
      {!submitted && (
        <>
          <h2>Your score = {score}</h2>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label htmlFor='numNonBlitzCards'>
                Number of non blitz cards
              </Form.Label>
               <Form.Control
                 name='numNonBlitzCards'
                 type='number'
                 onChange={onChangeNumNonBlitzCards}
                 value={numNonBlitzCards}
               />
            </Form.Group>
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
            <Form.Group className='mb-3'>
              <Button
                className='mb-3'
                variant='primary'
                onClick={onSubmit}
                disabled={numBlitzCards === undefined || numNonBlitzCards === undefined}
              >
                Submit
              </Button>
            </Form.Group>
          </Form>
        </>
      )}
      <h2>Last Round</h2>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Player Score</th>
          </tr>
        </thead>
        <tbody>
          {lobby.player_last_scores_sorted_desc.map(({ player_name, score }) => {
            return (
              <tr key={player_name}>
                <td>{player_name}</td>
                <td>{score}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <h2>Overall</h2>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Player Score</th>
          </tr>
        </thead>
        <tbody>
          {lobby.player_scores_sorted_desc.map(({ player_name, score }) => {
            return (
              <tr key={player_name}>
                <td>{player_name}</td>
                <td>{score}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default Round;