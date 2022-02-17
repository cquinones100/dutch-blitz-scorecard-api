class LobbiesController < ApplicationController
  def create
    lobby = Lobby.create

    render json: { id: encode(lobby.id) }
  end
end
