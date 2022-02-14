class PlayersController < ApplicationController
  def create
    lobby = Lobby.find_by(id: decode(params[:lobby_id]))
    player = Player.new(name: params[:name], lobby_id: lobby.id)

    if player.save
      LobbyChannel.broadcast(lobby)

      render json: Serializer.serialize(player, :name)
    else
      render json: player.errors, status: 422
    end
  end

  def index
    render json: Player.where(lobby_id: decode(params[:lobby_id])).map { |player| Serializer.serialize(player, :name) }
  end
end
