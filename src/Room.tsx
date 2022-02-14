import React, { useEffect, useRef, useState, ChangeEvent, SetStateAction } from 'react'
import { useParams } from 'react-router-dom';
import { Consumer, createConsumer } from '@rails/actioncable';
import { Form, Button, ListGroup, Alert } from 'react-bootstrap';

type Player = {
  name: string,
  id: string
}

type PlayerFormProps = {
  submitPlayer: (name: string) => void;
};

function PlayerForm({ submitPlayer }: PlayerFormProps ) {
  const [name, setName] = useState<string>('');

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    submitPlayer(name);
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
  const [players, setPlayers] = useState<Player[]>([]);
  const [nameError, setNameError] = useState<string | undefined>();

  useEffect(() => {
    consumer.current = createConsumer('http://blitz.cquinones.com/api/cable');
    consumer.current.subscriptions.create({
      channel: 'LobbyChannel',
      lobby_id: id
    }, {
      received({ data: { players } }: { data: { players: Player[] }}) {
        setPlayers(players);
      }
    });
  }, [id]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const initialResponse = await fetch('http://blitz.cquinones.com/api/players', {
        headers: {
          'content-type': 'application/json',
        }
      });

      const players = await initialResponse.json();

      setPlayers(players);
    }

    fetchPlayers();
  }, [])

  const submitPlayer = async (name: string) => {
    const initialResponse = await fetch('http://blitz.cquinones.com/api/players', {
      method: 'POST',
      body: JSON.stringify({
        name,
        lobby_id: id,
      }),
      headers: {
        'content-type': 'application/json',
      }
    });

    const player = await initialResponse.json();
      
    if (initialResponse.ok) {
      setNameError(undefined);
      setPlayer(player);
    } else {
      setNameError(player.name);
    }
  }

  return (
    <>
      {
      nameError && (
        <Alert variant='danger'>
          Name is already taken, please try another one
        </Alert>
      )}
      <h1>You are in room {id}</h1>
      {!player && id &&(
        <PlayerForm submitPlayer={submitPlayer} />
      )}
      {players.length > 0 && (
        <>
          <h2>Current Players</h2>
          <ListGroup>
            {players.map(({ name, id }: Player) => {
              return (
                <ListGroup.Item key={id}>
                  {name}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </>
      )}
    </>
  );
};
