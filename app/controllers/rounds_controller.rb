class RoundsController < ApplicationController
  def create
    lobby = Lobby.find_by(id: decode(params[:lobby_id]))

    Round.create(lobby: lobby)

    LobbyChannel.broadcast(lobby)
  end
end
