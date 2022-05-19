import Player from "./Player";
import PlayerScore from "./PlayerScore";

type Round = {
  id: string;
  lobby_id: number;
  player_scores: PlayerScore[]
  players: Player[];
  player_scores_sorted_desc: PlayerScore[];
};

export default Round;
