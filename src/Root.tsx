import React, { useState } from 'react';
import { Button, Row, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Root() {
  const navigate = useNavigate();

  const createLobby = async () => {
    const initialResponse = await fetch(`${process.env.REACT_APP_API_URL}/lobbies`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      }
    });

    const { id } = await initialResponse.json();

    navigate(`/room/${id}`);
  };

  return (
    <Row>
      <h1>Blitz!</h1>
      <Stack gap={2} className="col-md-5 mx-auto">
        <Button onClick={createLobby}>Create a Lobby</Button>
      </Stack>
    </Row>
  );
};