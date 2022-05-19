import Player from "./Player";
import PlayerScore from "./PlayerScore";
import Round from "./Round";

type Lobby = {
  id: string;
  rounds: Round[];
  players: Player[];
  current_round: Round;
  player_scores_sorted_desc: PlayerScore[];
  player_last_scores_sorted_desc: PlayerScore[];
  player_last_winning_score: PlayerScore;
};

export default Lobby;
