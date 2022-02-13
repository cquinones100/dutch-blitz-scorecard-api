import React, { useEffect, useRef, useState, ChangeEvent, SetStateAction } from 'react'
import { useParams } from 'react-router-dom';
import { Consumer, createConsumer } from '@rails/actioncable';
import { Form, Button } from 'react-bootstrap';

type Player = {
  name: string
}

type PlayerFormProps = {
  lobbyId: number;
  setPlayer: (player: Player) => void;
};

function PlayerForm({ lobbyId: lobby_id, setPlayer }: PlayerFormProps ) {
  const [name, setName] = useState<string>();

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const initialResponse = await fetch('http://blitz.cquinones.com/api/players', {
      method: 'POST',
      body: JSON.stringify({
        name,
        lobby_id,
      }),
      headers: {
        'content-type': 'application/json',
      }
    });

    const player = await initialResponse.json();

    setPlayer(player);
  };

  return(
    <Form onSubmit={onSubmit}>
      <Form.Label htmlFor='name'>
        Your Name
      </Form.Label>
      <Form.Control
        name='name'
        onChange={onChangeName}
        value={name}
      />
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default function Room() {
  const consumer = useRef<Consumer>();
  const { id } = useParams();
  const [player, setPlayer] = useState<Player>();

  useEffect(() => {
    consumer.current = createConsumer('http://blitz.cquinones.com/api/cable');
    consumer.current.subscriptions.create(
      { channel: 'LobbyChannel', lobby_id: id },
      { receivedData(data: string) { console.log(data) } }
    );
  }, [id]);

  return (
    <>
      <h1>You are in room {id}</h1>
      {!player && id &&(
        <PlayerForm setPlayer={setPlayer} lobbyId={Number(id)} />
      )}
    </>
  );
};
