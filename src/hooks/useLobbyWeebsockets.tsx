import { useEffect, useRef, useState } from 'react';
import { Player } from '../Room';
import { Consumer, createConsumer } from '@rails/actioncable';
import serverFetch from '../utils/serverFetch';

export type PlayerScore = Pick<Player, 'id'> & { value: number, round_number: number, player_name: string };

export type RoundType = {
  lobby_id: number;
  player_scores: PlayerScore[]
};

type BroadcastType ={
  data: {
    players: Player[],
    rounds: RoundType[]
  }
};

const useLobbyWebsockets = (roomId: string | undefined) => {
  const [players, setPlayers] = useState<Player[]>();
  const [rounds, setRounds] = useState<RoundType[]>();

  const consumer = useRef<Consumer>();

  useEffect(() => {
    if (roomId) {
      consumer.current = createConsumer(`${process.env.REACT_APP_API_URL}/cable`);
      consumer.current.subscriptions.create({
        channel: 'LobbyChannel',
        lobby_id: roomId
      }, {
        received({ data: { players, rounds } }: BroadcastType) {
          setPlayers(players);
          setRounds(rounds);
        },

        connected() {
          serverFetch().get(`/lobbies/${roomId}`);
        }
      });
    }
  }, [roomId]);

  return { players, rounds, setPlayers }
};

export default useLobbyWebsockets;
