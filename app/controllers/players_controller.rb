class PlayersController < ApplicationController
  def create
    lobby = Lobby.find_by(id: decode(params[:lobby_id]))
    player = Player.create(name: params[:name], lobby_id: lobby.id)

    LobbyChannel.broadcast(lobby)

    render json: Serializer.serialize(player, :name)
  end

  def index
    render json: Player.all.map { |player| Serializer.serialize(player, :name) }
  end
end
