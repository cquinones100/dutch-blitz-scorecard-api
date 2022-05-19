class LobbyChannel < ApplicationCable::Channel
  def subscribed
    stream_from "lobby_#{params[:lobby_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    lobby = Lobby.find_by(id: self.class.decode(data['lobby_id']))

    LobbyChannel.broadcast(lobby)
  end

  class << self
    delegate :decode, :encode, to: :hash_ids

    def broadcast(lobby)
      ActionCable.server.broadcast("lobby_#{encode(lobby.id)}", {
        data: {
          lobby: lobby.serialize,
        }
      })
    end

    private

    def hash_ids
      @has_ids ||= Hashids.new('this is my salt', 5)
    end
  end
end
  