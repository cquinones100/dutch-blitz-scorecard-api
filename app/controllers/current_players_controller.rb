class CurrentPlayersController < ApplicationController
  def show
    player_hash = JWT.decode(request.headers['Authorization'], 'secret')[0]

    player = Player.find_by(
      id: player_hash['player_id'],
      lobby_id: player_hash['lobby_id']
    )

    if player
      render json: player.serialize
    else
      render json: {}, status: 404
    end
  end
end
