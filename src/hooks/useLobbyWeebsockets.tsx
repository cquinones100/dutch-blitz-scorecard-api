import { useEffect, useRef, useState } from 'react';
import { Player } from '../Room';
import { Consumer, createConsumer } from '@rails/actioncable';

type RoundType = {
  lobby_id: number;
  scores: Player & { score: number }
};

type BroadcastType ={
  data: {
    players: Player[],
    rounds: RoundType[]
  }
};

const useLobbyWebsockets = (roomId: number) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<RoundType[]>([]);

  const consumer = useRef<Consumer>();

  useEffect(() => {
    consumer.current = createConsumer(`${process.env.API_URL}/cable`);
    consumer.current.subscriptions.create({
      channel: 'LobbyChannel',
      lobby_id: roomId
    }, {
      received({ data: { players, rounds } }: BroadcastType) {
        setPlayers(players);
        setRounds(rounds);
      }
    });
  }, [roomId]);

  return [players, rounds, setPlayers];
};

export default useLobbyWebsockets;
