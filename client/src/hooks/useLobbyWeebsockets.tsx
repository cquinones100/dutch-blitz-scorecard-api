import { useEffect, useRef, useState } from 'react';
import { Consumer, createConsumer } from '@rails/actioncable';
import serverFetch from '../utils/serverFetch';
import Lobby from '../types/Lobby';
import Player from '../types/Player';
import Round from '../types/Round';

type BroadcastType ={
  data: {
    players: Player[];
    rounds: Round[];
    lobby: Lobby;
  };
};

const useLobbyWebsockets = (roomId: string | undefined) => {
  const [lobby, setLobby] = useState<Lobby>();

  const consumer = useRef<Consumer>();

  useEffect(() => {
    if (roomId) {
      consumer.current = createConsumer(`${process.env.REACT_APP_API_URL}/cable`);
      consumer.current.subscriptions.create({
        channel: 'LobbyChannel',
        lobby_id: roomId
      }, {
        received({ data: { lobby } }: BroadcastType) {
          setLobby(lobby);
        },

        connected() {
          serverFetch().get(`/lobbies/${roomId}`);
        }
      });
    }
  }, [roomId]);

  return {
    players: lobby?.players,
    rounds: lobby?.rounds,
    lobby
  }
};

export default useLobbyWebsockets;
