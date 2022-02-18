import React, { useEffect, useState, ChangeEvent } from 'react'
import { useParams } from 'react-router-dom';
import { Form, Button, ListGroup, Alert, Row, Col, Badge } from 'react-bootstrap';
import useLobbyWebsockets from './hooks/useLobbyWebsockets';

export type Player = {
  name: string;
  id: string;
  ready: boolean;
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
  const { id } = useParams();
  const [player, setPlayer] = useState<Player | null>();
  const [nameError, setNameError] = useState<string | undefined>();
  const [players, rounds, setPlayers] = useLobbyWebsockets(id);

  const { token, fetching, setToken } = usePersistence(id);

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

    const { player, token } = await initialResponse.json();
      
    if (initialResponse.ok) {
      setNameError(undefined);
      setPlayer(player);
      setToken(token);
    } else {
      setNameError(player.name);
    }
  }

  const onReady = async () => {
    if (!player) { return; }

    const initialResponse = await fetch(`http://blitz.cquinones.com/api/lobbies/${id}/players/${player.id}/player_readies`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      }
    });

    if (initialResponse.ok) {
      setPlayer({
        ...player,
        ready: true
      });
    }
  };

  if (fetching) return <></>;

  return (
    <>
      {
      nameError && (
        <Row>
          <Alert variant='danger'>
            Name is already taken, please try another one
          </Alert>
        </Row>
      )}
      <Row>
        <Col xs={8}>
          <h1>{player && `Hi ${player.name}, y`}{!player && 'Y'}ou are in room {id}</h1>
        </Col>
        <Col xs={4}>
          {player && !player.ready && (
            <Button variant='success' onClick={onReady}>I'm Ready!</Button>
          )}
        </Col>
      </Row>
      {!player && id &&(
        <PlayerForm submitPlayer={submitPlayer} />
      )}
      {players.length > 0 && (
        <>
          <h2>Current Players</h2>
          <ListGroup>
            {players.map(({ name, id, ready }: Player) => {
              return (
                <ListGroup.Item key={id}>
                  {name} {ready ? <Badge bg='success'>Ready!</Badge> : <Badge bg='danger'>Not ready</Badge>}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </>
      )}
    </>
  );
};
