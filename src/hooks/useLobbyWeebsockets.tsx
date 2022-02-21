import { useEffect, useRef, useState } from 'react';
import { Lobby, Player } from '../Room';
import { Consumer, createConsumer } from '@rails/actioncable';
import serverFetch from '../utils/serverFetch';

export type PlayerScore = {
  player_name: string;
  score: number;
}

export type RoundType = {
  lobby_id: number;
  player_scores: PlayerScore[]
  players: Player[];
};

type BroadcastType ={
  data: {
    players: Player[];
    rounds: RoundType[];
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
