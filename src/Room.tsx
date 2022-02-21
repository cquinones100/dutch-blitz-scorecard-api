import React, { useState, ChangeEvent } from 'react'
import { useParams } from 'react-router-dom';
import { Form, Button, ListGroup, Alert, Col, Badge, Row as BootstrapRow, } from 'react-bootstrap';
import useLobbyWebsockets from './hooks/useLobbyWeebsockets';
import usePersistence from './hooks/usePersistence';
import Round from './Round';
import serverFetch from './utils/serverFetch';
import RoundTransition from './RoundTransition';
import QRCode from 'qrcode.react';
import Row from './layout/Row';
import useRoundTransition from './hooks/useRoundTransition';
import Player from './types/Player';

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
  const { lobby } = useLobbyWebsockets(id);

  const { fetching, setToken, tokenFetch } = usePersistence(id, setPlayer);

  const [transitioningRound, setTransitioningRound] = useRoundTransition(lobby);

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

  if (fetching || !lobby) return <></>;

  if (transitioningRound) {
    return (
      <RoundTransition
        setTransitioningRound={setTransitioningRound}
        winner={lobby?.player_last_winning_score}
      />
    );
  }

  if (lobby && lobby.current_round && player && lobby.current_round.players) {
    const updateScore = async (value: number) => {
      await tokenFetch!.post(`/lobbies/${id}/players/${player.id}/player_scores`, {
        value
      });
    };

    return (
      <Round
        number={lobby.rounds.length}
        updateScore={updateScore}
        lobby={lobby}
        round={lobby.current_round}
        player={player}
      />
    );
  }

  return (
    <Row>
      {nameError && (
        <BootstrapRow>
          <Alert variant='danger'>
            Name is already taken, please try another one
          </Alert>
        </BootstrapRow>
      )}
      <BootstrapRow>
        <Col xs={8}>
          <h1>{player && `Hi ${player.name}, y`}{!player && 'Y'}ou are in room {id}</h1>
        </Col>
        <Col xs={4}>
          {player && !player.ready && tokenFetch && (
            <Button variant='success' onClick={onReady}>I'm Ready!</Button>
          )}
        </Col>
      </BootstrapRow>
      {id && !tokenFetch && <PlayerForm submitPlayer={submitPlayer} />}
      {lobby.players.length > 0 && (
        <>
          <h2>Current Players</h2>
          <ListGroup>
            {lobby.players.map(({ name, id, ready }: Player) => {
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
    </Row>
  );
};
