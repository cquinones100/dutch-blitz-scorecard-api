class LobbiesController < ApplicationController
  def create
    lobby = Lobby.create

    render json: { id: encode(lobby.id) }
  end

  def join
    player = Player.find_by(id: params[:player_id])
    lobby = Lobby.find_by(id: decode(params[:id]))

    LobbyChannel.broadcast(lobby)
  end
end
