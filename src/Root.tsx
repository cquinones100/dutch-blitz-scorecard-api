import React, { useState } from 'react';
import { Button, Row, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Root() {
  const navigate = useNavigate();

  const createLobby = async () => {
    const initialResponse = await fetch('http://blitz.cquinones.com/api/lobbies', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      }
    });

    const { id } = await initialResponse.json();

    navigate(`/room/${id}`);
  };

  const [enteringRoom, setEnteringRoom] = useState(false);

  return (
    <Row>
      <h1>Blitz!</h1>
      <Stack gap={2} className="col-md-5 mx-auto">
        <Button onClick={createLobby}>Create a Lobby</Button>
        <Button onClick={() => { setEnteringRoom(true) }}>Enter Lobby Code</Button>
      </Stack>
    </Row>
  );
};