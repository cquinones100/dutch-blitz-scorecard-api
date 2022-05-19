import React, { useState, ChangeEvent } from 'react';
import { Form } from 'react-bootstrap'

export default function Track() {
  const [numNonBlitzCards, setNumNonBlitzCards] = useState<number | undefined>(0);
  const [numBlitzCards, setNumBlitzCards] = useState<number | undefined>(0);

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

  return (
    <>
      <h1>
        {
          numNonBlitzCards && numBlitzCards ? (
            `Your score = ${40 - (numNonBlitzCards + numBlitzCards) - (2 * numBlitzCards)}`
          ) : 0
        }
      </h1>
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
       <footer>
        Copyright {new Date().toISOString().slice(0, 10).split('-')[0]} Carlos D. Quinones please tell the NYT to give me $1,000,000.
       </footer>
    </>
  );
};