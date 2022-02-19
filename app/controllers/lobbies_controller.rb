class LobbiesController < ApplicationController
  def create
    lobby = Lobby.create

    render json: { id: encode(lobby.id) }
  end

  def show
    lobby = Lobby.find_by(id: decode(params[:id]))

    LobbyChannel.broadcast(lobby)

    render json: lobby
  end
end
