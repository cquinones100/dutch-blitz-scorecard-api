class RoundsController < ApplicationController
  def create
    lobby = Lobby.find_by(id: decode(params[:lobby_id]))

    round = Round.create(lobby: lobby)

    LobbyChannel.broadcast(lobby)

    render json: round, status: 201
  end
end
