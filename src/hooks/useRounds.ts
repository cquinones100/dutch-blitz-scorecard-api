import { useCallback, useEffect, useRef, useState } from "react";
import { Player } from "../Room";
import serverFetch from "../utils/serverFetch";
import { RoundType } from "./useLobbyWeebsockets";

const useRounds = (
  player: Player | null | undefined,
  players: Player[] | null | undefined,
  rounds: RoundType[] | null | undefined,
  tokenFetch: ReturnType<typeof serverFetch> | null | undefined,
  roomId: Player['lobby_id'] | null | undefined
) => {
  const [query, setQuery] = useState<Promise<unknown> | null>()
  const prevQuery = useRef();

  const asLeader = useCallback((cb: () => void) => {
    if (players && (player?.name === players[0]?.name)) {
      cb();
    }
  }, [players, player]);
  
  const incrementRound = useCallback(() => {
    setQuery(
      tokenFetch!
        .post<null, null>(`/lobbies/${roomId}/rounds`)
        .then(() => {
          setQuery(null)
        })
    );
  }, [roomId, tokenFetch]);

  useEffect(() => {
    if (query) {
      if (prevQuery.current) {
        (query as unknown as  { cancel: () => void; }).cancel();
      }
    }
  }, [query]);

  useEffect(() => {
    asLeader(() => {
      if (!query && rounds && rounds[rounds.length - 1]?.player_scores.every(({ value }) => value !== null)) {
        incrementRound();
      }
    })
  }, [incrementRound, rounds, asLeader, query]);

  useEffect(() => {
    asLeader(() => {
      if (rounds && rounds?.length === 0 &&
          players && players?.length > 1 &&
          players?.every(({ ready }) => ready) &&
           tokenFetch && !query) {
            incrementRound();
          }
    });
  }, [player, players, rounds, tokenFetch, roomId, query, incrementRound, asLeader]);

  return { incrementRound };
};

export default useRounds;