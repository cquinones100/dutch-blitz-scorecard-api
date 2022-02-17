import React, { useEffect, useRef, useState, ChangeEvent, SetStateAction } from 'react'
import { useParams } from 'react-router-dom';
import { Consumer, createConsumer } from '@rails/actioncable';
import { Form, Button, ListGroup, Alert, Row, Col, Badge } from 'react-bootstrap';

type Player = {
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
  const consumer = useRef<Consumer>();
  const { id } = useParams();
  const [player, setPlayer] = useState<Player>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [nameError, setNameError] = useState<string | undefined>();
  const [token, setToken] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const initialFetch = async () => {
      const sessionToken = sessionStorage.getItem('token');

      setToken(sessionToken);

      const headers: HeadersInit = {
        'content-type': 'application/json',
      };

      if (sessionToken) {
        headers['Authorization'] = sessionToken;
      }

      if (sessionToken) { 
        const initialResponse = await fetch(`http://blitz.cquinones.com/api/current_player`, {
          headers
        });

        const player = await initialResponse.json();

        setPlayer(player);
      }

      const initialResponse = await fetch(`http://blitz.cquinones.com/api/lobbies/${id}/players`, {
        headers
      });

      const players = await initialResponse.json();

      setPlayers(players);

      setFetching(false);
    }

    initialFetch();
  }, []);

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
    if (token) {
      sessionStorage.setItem('token', token);
    }
  }, [token]);

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
          <h1>You are in room {id}</h1>
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
