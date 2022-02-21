import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Lobby } from "../Room";
import { RoundType } from "./useLobbyWeebsockets";

const useRoundTransition = (
  lobby: Lobby | undefined
): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const roundsRef = useRef<RoundType[]>(); 
  const [transitioningRound, setTransitioningRound] = useState(false);

  useEffect(() => {
    if (lobby) {
      if (roundsRef.current && lobby.rounds.length !== roundsRef.current.length) {
        setTransitioningRound(true);
      }

      roundsRef.current = lobby.rounds
    }

  }, [lobby])

  return [transitioningRound, setTransitioningRound];
};

export default useRoundTransition;