import { useEffect, useState } from "react";

const usePersistence = (roomId, setPlayer, setPlayers) => {
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const initialFetch = async () => {
      const [token, setToken] = useState<string | null>(null);
      const sessionToken = sessionStorage.getItem('token');

      setToken(sessionToken);

      const headers: HeadersInit = {
        'content-type': 'application/json',
      };

      if (sessionToken) {
        headers['Authorization'] = sessionToken;
      }

      if (sessionToken) { 
        const initialResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/current_player`,
          { headers }
        );

        const player = await initialResponse.json();

        if (player.lobby_id !== roomId) {
          setPlayer(null);
          
          sessionStorage.removeItem('token');
        }

        setPlayer(player);
      }

      const initialResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/lobbies/${roomId}/players`,
        { headers }
      );

      const players = await initialResponse.json();

      setPlayers(players);

      setFetching(false);
    }

    initialFetch();
  }, [roomId]);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', token);
    }
  }, [token]);

  return { token, fetching, setToken };
};

export default usePersistence;
