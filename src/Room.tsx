import React, { useState, ChangeEvent, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { Form, Button, ListGroup, Alert, Row, Col, Badge } from 'react-bootstrap';
import useLobbyWebsockets, { RoundType } from './hooks/useLobbyWeebsockets';
import usePersistence from './hooks/usePersistence';
import Round from './Round';
import serverFetch from './utils/serverFetch';
import RoundTransition from './RoundTransition';
import QRCode from 'qrcode.react';

export type Player = {
  name: string;
  id: string;
  ready: boolean;
  lobby_id: string;
  score: number;
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
  const { players, rounds, setPlayers } = useLobbyWebsockets(id);
  const [transitioningRound, setTransitioningRound] = useState(false);

  const { fetching, setToken, tokenFetch } = usePersistence(id, setPlayer, setPlayers);

  const submitPlayer = async (name: string) => {
    const { status, body: { player, token } } = await serverFetch().post<
      { name: string, lobby_id: string },
      { player: Player, token: string }
    >('/players', { name, lobby_id: id! })
      
    if (status === 201) {
      setNameError(undefined);
      setPlayer(player);
      setToken(token);
    } else {
      setNameError(player.name);
    }
  }

  const onReady = async () => {
    if (!player) { return; }

    const { status } = await tokenFetch!.post(`/lobbies/${id}/players/${player.id}/player_readies`);

    if (status === 201) {
      setPlayer({
        ...player,
        ready: true
      });
    }
  };

  const roundsRef = useRef<RoundType[]>(); 

  useEffect(() => {
    if (roundsRef.current && rounds && rounds.length !== roundsRef.current.length) {
      setTransitioningRound(true);
    }

    roundsRef.current = rounds
  }, [rounds])

  const winner = rounds && rounds?.length > 1 ? players?.sort((a: Player, b: Player) => b.score - a.score)[0] : undefined;

  if (transitioningRound) {
    return <RoundTransition setTransitioningRound={setTransitioningRound} winner={winner}/>;
  }

  if (fetching || !players) return <></>;

  if (rounds && players && player && rounds?.length > 0) {
    const updateScore = async (value: number) => {
      await tokenFetch!.post(`/lobbies/${id}/players/${player.id}/player_scores`, {
        value
      });
    };

    return <Round number={rounds.length} players={players} updateScore={updateScore} />;
  }

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
          {player && !player.ready && tokenFetch && (
            <Button variant='success' onClick={onReady}>I'm Ready!</Button>
          )}
        </Col>
      </Row>
      {id && !tokenFetch && <PlayerForm submitPlayer={submitPlayer} />}
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
      <QRCode value={window.location.href} />
    </>
  );
};
