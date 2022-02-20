import React, { useState, ChangeEvent, useEffect } from 'react';
import { Form, Table, Button } from 'react-bootstrap';
import { Player } from './Room';

const Round = (
  { number, players, updateScore }:
  { number: number, players: Player[], updateScore: (value: number) => void; }
) => {
  const [numNonBlitzCards, setNumNonBlitzCards] = useState<number | undefined>();
  const [numBlitzCards, setNumBlitzCards] = useState<number | undefined>();
  const [submitted, setSubmitted] = useState(false);

  const score = numNonBlitzCards !== undefined && numBlitzCards !== undefined ?
    40 - (numNonBlitzCards! + numBlitzCards!) - (2 * numBlitzCards!) :
    0;

  useEffect(() => {
    setSubmitted(false);
  }, [number]);

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
                disabled={numBlitzCards === undefined && numNonBlitzCards === undefined}
              >
                Submit
              </Button>
            </Form.Group>
          </Form>
        </>
      )}
      <Table striped bordered>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Player Score</th>
          </tr>
        </thead>
        <tbody>
          {players.map(({ name, score }) => {
            return (
              <tr key={name}>
                <td>{name}</td>
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