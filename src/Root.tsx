import React from 'react';
import { Button, Col, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Row from './layout/Row';

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
    <Row className='align-items-center' style={{ height: '80%' }}>
      <Col>
        <h1 style={{ textAlign: 'center' }}>Blitz!</h1>
        <Stack gap={2} className="col-md-5 mx-auto">
          <Button onClick={createLobby}>Create a Lobby</Button>
        </Stack>
      </Col>
    </Row>
  );
};