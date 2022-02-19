import { useEffect, useRef, useState } from "react";
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
  const [query, setQuery] = useState<Promise<unknown>>()
  const prevQuery = useRef();

  useEffect(() => {
    if (query) {
      if (prevQuery.current) {
        (query as unknown as  { cancel: () => void; }).cancel();
      }
    }
  }, [query]);

  useEffect(() => {
    if (rounds && rounds?.length === 0 &&
        players && players?.length > 1 &&
        players?.every(({ ready }) => ready) &&
        player?.name === players[0]?.name && tokenFetch && !query) {
          setQuery(tokenFetch!.post(`/lobbies/${roomId}/rounds`));
        }
  }, [player, players, rounds, tokenFetch, roomId, query]);
};

export default useRounds;