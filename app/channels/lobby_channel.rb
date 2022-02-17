class LobbyChannel < ApplicationCable::Channel
  def subscribed
    stream_from "lobby_#{params[:lobby_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  class << self
    delegate :decode, :encode, to: :hash_ids

    def broadcast(lobby)
      ActionCable.server.broadcast("lobby_#{encode(lobby.id)}", {
        data: {
          players: lobby.players.map(&:serialize),
          lobby: Serializer.serialize(lobby, :id),
          rounds: lobby.rounds.order(:created_at).map { |round| Serializer.serialize(round, lobby_id: encode(lobby.id)) }
        }
      })
    end

    private

    def hash_ids
      @has_ids ||= Hashids.new('this is my salt', 5)
    end
  end
end
  