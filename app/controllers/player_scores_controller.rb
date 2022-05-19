class PlayerScoresController < ApplicationController
  def create
    lobby = Lobby.find_by(id: decode(params[:lobby_id]))

    player_score = PlayerScore.find_by(player_id: decode(params[:player_id]),
                                       round_id: lobby.rounds.last)

    if player_score.update(value: params[:value])
      LobbyChannel.broadcast(lobby)

      render json: player_score, status: 201
    end
  end

  def index
    player_scores = PlayerScore.where(round_id: decode(round_id))

    render json: player_scores
  end
end

