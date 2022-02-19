import React, { useState, ChangeEvent, useEffect } from 'react';
import { Form, Table, Button } from 'react-bootstrap';
import { Player } from './Room';

const Round = (
  { number, players, updateScore }:
  { number: number, players: Player[], updateScore: (value: number) => void; }
) => {
  const [numNonBlitzCards, setNumNonBlitzCards] = useState<number | undefined>(0);
  const [numBlitzCards, setNumBlitzCards] = useState<number | undefined>(0);
  const [submitted, setSubmitted] = useState(false);

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
    updateScore(40 - (numNonBlitzCards! + numBlitzCards!) - (2 * numBlitzCards!));
    setNumBlitzCards(0);
    setNumNonBlitzCards(0);
    setSubmitted(true);
  };

  return (
    <>
      <h1>Round {number}</h1>
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
      {!submitted && (
        <>
          <h2>
            {numNonBlitzCards && numBlitzCards ? (
              `Your score = ${40 - (numNonBlitzCards + numBlitzCards) - (2 * numBlitzCards)}`
            ) : <></>}
          </h2>
           <Form.Label htmlFor='numNonBlitzCards'>
             Number of non blitz cards
           </Form.Label>
            <Form.Control
              name='numNonBlitzCards'
              type='number'
              onChange={onChangeNumNonBlitzCards}
              value={numNonBlitzCards}
            />
           <Form.Label htmlFor='numNonBlitzCards'>
             Number of blitz cards
           </Form.Label>
           <Form.Control
             name='numBlitzCards'
             type='number'
             onChange={onChangeNumBlitzCards}
             value={numBlitzCards}
           />
            {numNonBlitzCards && numBlitzCards ? (
              <Button
                variant='primary'
                onClick={onSubmit}
              >
                Submit
              </Button>
            ) : <></>}
          </>
        )}
    </>
  );
};

export default Round;