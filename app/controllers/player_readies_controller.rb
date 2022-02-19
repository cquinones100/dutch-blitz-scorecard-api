class PlayerReadiesController < ApplicationController
  def create
    player = Player.find_by(id: decode(params[:player_id]))
    lobby = Lobby.find_by(id: decode(params[:lobby_id]))

    player_ready = PlayerReady.create(player: player, lobby: lobby)

    LobbyChannel.broadcast(lobby)

    render json: player_ready, status: 201
  end
end
