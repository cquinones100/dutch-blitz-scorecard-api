class PlayersController < ApplicationController
  def create
    lobby = Lobby.find_by(id: decode(params[:lobby_id]))
    player = Player.new(name: params[:name], lobby_id: lobby.id)

    if player.save
      LobbyChannel.broadcast(lobby)

      json = {
        player: Serializer.serialize(player, :name),
        token: JWT.encode({ player_id: player.id, lobby_id: lobby.id }, 'secret')
      }

      render json: json
    else
      render json: player.errors, status: 422
    end
  end

  def index
    render json: Player.where(lobby_id: decode(params[:lobby_id])).map(&:serialize)
  end
end
